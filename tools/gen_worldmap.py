#!/usr/bin/env python3
"""Raster de landen van Natural Earth 110m op het dot-raster van de wereldkaart.

Download eerst de bron (publiek domein, ~0,8 MB) naast dit script:

    curl -sSL -o tools/ne_110m.geojson \\
      https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson

en draai daarna `python3 tools/gen_worldmap.py` om src/worldmapdata.ts opnieuw te maken.

Leest ne_110m.geojson en bepaalt voor elke cel van een equirectangulair
dot-raster welk land (als er een is) het midden van de cel bedekt. Schrijft een
compacte TypeScript-module (src/worldmapdata.ts) met:

  - het raster, run-length gecodeerd als paren (landindex van de cel, lengte),
  - de landentabel (iso a2, iso a3, naam, index van het werelddeel),
  - de zes werelddelen + hoeveel landen elk heeft,
  - een paar constanten van het raster.

Index 0 betekent oceaan of geen land. Antarctica en open oceaan vallen weg. Elk
land dat geen eigen cel krijgt (te klein voor het raster) krijgt het labelpunt
van Natural Earth op de dichtstbijzijnde vrije cel, zodat het toch kan
oplichten.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

SRC = Path(__file__).with_name("ne_110m.geojson")
OUT = Path(__file__).with_name("worldmapdata.ts")

# Equirectangulair venster op het dot-raster. Westrand en volle 360 graden breed,
# zodat Nieuw-Zeeland en het uiterste oosten van Rusland er niet af vallen;
# Antarctica valt onderaan weg. Graden per kolom en per rij liggen dicht bij
# elkaar, zodat land in verhouding blijft (gewoon equirectangulair, zoals de
# minikaart van de poster).
LON0 = -169.0
LON_SPAN = 360.0
COLS = 100
LAT_TOP = 83.0
LAT_BOTTOM = -57.0
ROWS = 40

DLON = LON_SPAN / COLS
DLAT = (LAT_TOP - LAT_BOTTOM) / ROWS

CONTINENTS = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"]
CONT_INDEX = {name: i for i, name in enumerate(CONTINENTS)}

# Een paar betwiste gebieden zonder ISO-code, die Natural Earth "-99" geeft.
# Geef ze vaste eigen codes, zodat de kaart compleet is en ze in de config te
# vinden blijven (meestal op naam).
ISO_OVERRIDES = {
    "Kosovo": ("XK", "XKX"),
    "Somaliland": ("XA", "XAA"),
    "Northern Cyprus": ("XB", "XBB"),
}


def iso_codes(props: dict) -> tuple[str, str]:
    name = props.get("ADMIN") or props.get("NAME") or ""
    if name in ISO_OVERRIDES:
        return ISO_OVERRIDES[name]
    a2 = props.get("ISO_A2_EH")
    if not a2 or a2 == "-99":
        a2 = props.get("ISO_A2")
    a3 = props.get("ISO_A3_EH")
    if not a3 or a3 == "-99":
        a3 = props.get("ISO_A3")
    if not a2 or a2 == "-99":
        a2 = (props.get("POSTAL") or "")[:2]
    if not a3 or a3 == "-99":
        a3 = props.get("ADM0_A3") or ""
    return a2, a3


def ring_contains(ring: list, x: float, y: float) -> bool:
    """Test met een straal of een punt binnen een ring ligt."""
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if (yi > y) != (yj > y):
            xin = (xj - xi) * (y - yi) / (yj - yi) + xi
            if x < xin:
                inside = not inside
        j = i
    return inside


def polygon_contains(rings: list, x: float, y: float) -> bool:
    """Binnen de buitenring en buiten elk gat."""
    if not rings or not ring_contains(rings[0], x, y):
        return False
    for hole in rings[1:]:
        if ring_contains(hole, x, y):
            return False
    return True


def bbox(rings: list) -> tuple[float, float, float, float]:
    xs = [p[0] for p in rings[0]]
    ys = [p[1] for p in rings[0]]
    return min(xs), min(ys), max(xs), max(ys)


def main() -> None:
    gj = json.loads(SRC.read_text())

    countries: list[dict] = []  # geordend; het raster bewaart index+1
    polys: list[tuple[int, list, tuple]] = []  # (landindex, ringen, bbox)
    cont_totals = [0] * len(CONTINENTS)

    for feat in gj["features"]:
        props = feat["properties"]
        cont = props.get("CONTINENT")
        if cont not in CONT_INDEX:
            continue  # Antarctica, open oceaan
        a2, a3 = iso_codes(props)
        name = props.get("NAME_LONG") or props.get("ADMIN") or props.get("NAME") or ""
        ci = len(countries)
        countries.append(
            {
                "iso2": (a2 or "").upper(),
                "iso3": (a3 or "").upper(),
                "name": name,
                "cont": CONT_INDEX[cont],
                "label": [props.get("LABEL_X"), props.get("LABEL_Y")],
                "cells": 0,
            }
        )
        cont_totals[CONT_INDEX[cont]] += 1

        geom = feat["geometry"]
        parts = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        for rings in parts:
            polys.append((ci, rings, bbox(rings)))

    # grid[r][c] = landindex + 1, of 0 voor oceaan.
    grid = [[0] * COLS for _ in range(ROWS)]
    for r in range(ROWS):
        lat = LAT_TOP - (r + 0.5) * DLAT
        for c in range(COLS):
            lon = LON0 + (c + 0.5) * DLON
            g = lon - 360.0 if lon > 180.0 else lon  # terug naar [-180, 180]
            for ci, rings, (x0, y0, x1, y1) in polys:
                if g < x0 or g > x1 or lat < y0 or lat > y1:
                    continue
                if polygon_contains(rings, g, lat):
                    grid[r][c] = ci + 1
                    countries[ci]["cells"] += 1
                    break

    # Geef elk land zonder cel een plek op de cel van zijn labelpunt (of de
    # dichtstbijzijnde vrije of oceaancel), zodat zelfs het kleinste land oplicht.
    forced = 0
    for ci, country in enumerate(countries):
        if country["cells"] > 0:
            continue
        lx, ly = country["label"]
        if lx is None or ly is None:
            continue
        lon = lx + 360.0 if lx < LON0 else lx
        cc = int((lon - LON0) / DLON)
        cr = int((LAT_TOP - ly) / DLAT)
        placed = False
        for radius in range(0, 3):
            for dr in range(-radius, radius + 1):
                for dc in range(-radius, radius + 1):
                    rr, ccx = cr + dr, cc + dc
                    if 0 <= rr < ROWS and 0 <= ccx < COLS and grid[rr][ccx] == 0:
                        grid[rr][ccx] = ci + 1
                        country["cells"] += 1
                        placed = True
                        break
                if placed:
                    break
            if placed:
                break
        # Kleine landen zonder zee en zonder vrije oceaancel in de buurt: neem de
        # labelcel over van een buur die er een kan missen (meer dan één cel).
        if not placed and 0 <= cr < ROWS and 0 <= cc < COLS:
            owner = grid[cr][cc]
            if owner and countries[owner - 1]["cells"] > 1:
                countries[owner - 1]["cells"] -= 1
                grid[cr][cc] = ci + 1
                country["cells"] += 1
                placed = True
        if placed:
            forced += 1

    # Run-length-codering van het platte raster.
    flat = [grid[r][c] for r in range(ROWS) for c in range(COLS)]
    rle: list[int] = []
    i = 0
    while i < len(flat):
        v = flat[i]
        j = i
        while j < len(flat) and flat[j] == v:
            j += 1
        rle.append(v)
        rle.append(j - i)
        i = j

    land_cells = sum(1 for v in flat if v)
    zero = [c["name"] for c in countries if c["cells"] == 0]

    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace('"', '\\"')

    lines: list[str] = []
    lines.append("/* GEGENEREERD door tools/gen_worldmap.py; niet met de hand aanpassen.")
    lines.append(" * Bron: Natural Earth 110m admin-0 countries (publiek domein).")
    lines.append(" * Gerasterd op het equirectangulaire dot-raster van de wereldkaart. */")
    lines.append("")
    lines.append("export interface Country {")
    lines.append("  /** ISO 3166-1 alpha-2 (of een eigen code voor betwiste gebieden). */")
    lines.append("  iso2: string;")
    lines.append("  /** ISO 3166-1 alpha-3. */")
    lines.append("  iso3: string;")
    lines.append("  /** Engelse naam van het land. */")
    lines.append("  name: string;")
    lines.append("  /** Index in CONTINENTS. */")
    lines.append("  cont: number;")
    lines.append("}")
    lines.append("")
    lines.append(f"export const COLS = {COLS};")
    lines.append(f"export const ROWS = {ROWS};")
    lines.append(f"export const LON0 = {LON0};")
    lines.append(f"export const LON_SPAN = {LON_SPAN};")
    lines.append(f"export const LAT_TOP = {LAT_TOP};")
    lines.append(f"export const LAT_BOTTOM = {LAT_BOTTOM};")
    lines.append("")
    lines.append(
        "export const CONTINENTS: readonly string[] = ["
        + ", ".join(f'"{c}"' for c in CONTINENTS)
        + "];"
    )
    lines.append("")
    lines.append(
        "/** Landen per werelddeel in de data (de noemer van de meters). */"
    )
    lines.append(
        "export const CONTINENT_TOTALS: readonly number[] = ["
        + ", ".join(str(t) for t in cont_totals)
        + "];"
    )
    lines.append("")
    lines.append("/** Landentabel; het raster bewaart (index + 1), 0 = oceaan. */")
    lines.append("export const COUNTRIES: readonly Country[] = [")
    for c in countries:
        lines.append(
            f'  {{ iso2: "{esc(c["iso2"])}", iso3: "{esc(c["iso3"])}", '
            f'name: "{esc(c["name"])}", cont: {c["cont"]} }},'
        )
    lines.append("];")
    lines.append("")
    lines.append(
        "/** Plat raster, rij voor rij, run-length gecodeerd als [waarde, aantal, waarde, aantal, ...]. */"
    )
    lines.append("export const GRID_RLE: readonly number[] = [")
    # de RLE-getallen per ~20 paren afbreken, voor de leesbaarheid
    buf = []
    for k in range(0, len(rle), 2):
        buf.append(f"{rle[k]},{rle[k + 1]}")
        if len(buf) == 20:
            lines.append("  " + ", ".join(buf) + ",")
            buf = []
    if buf:
        lines.append("  " + ", ".join(buf) + ",")
    lines.append("];")
    lines.append("")

    OUT.write_text("\n".join(lines))

    print(f"countries: {len(countries)}  land cells: {land_cells}  ocean: {len(flat) - land_cells}")
    print(f"continent totals: {dict(zip(CONTINENTS, cont_totals))}")
    print(f"forced tiny countries onto a cell: {forced}")
    print(f"still zero-cell (invisible): {zero}")
    print(f"RLE pairs: {len(rle)//2}  out bytes: {OUT.stat().st_size}")


if __name__ == "__main__":
    main()
