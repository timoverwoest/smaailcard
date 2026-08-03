#!/usr/bin/env python3
"""Rasterise Natural Earth 110m countries onto the world card's dot grid.

Download the source first (public domain, ~0.8 MB), next to this script:

    curl -sSL -o tools/ne_110m.geojson \\
      https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson

then run `python3 tools/gen_worldmap.py` to regenerate src/worldmapdata.ts.

Reads ne_110m.geojson and, for every cell of an
equirectangular dot grid, works out which country (if any) covers the cell
centre. Emits a compact TypeScript module (src/worldmapdata.ts) holding:

  - the grid, run-length encoded (cellCountryIndex, runLength) pairs,
  - the country table (iso a2, iso a3, name, continent index),
  - the six continent names + how many countries each holds,
  - a couple of grid constants.

Index 0 means ocean / no country. Antarctica and open-ocean features are
dropped. Every country that ends up with no cell of its own (too small for the
grid) gets its Natural Earth label point forced onto the nearest free cell so it
can still light up.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

SRC = Path(__file__).with_name("ne_110m.geojson")
OUT = Path(__file__).with_name("worldmapdata.ts")

# Equirectangular window mapped onto the dot grid. West edge, full 360 wide, so
# New Zealand and the Russian far east don't fall off; Antarctica cropped off
# the bottom. Degrees-per-column and per-row are kept close so land stays in
# proportion (plain equirectangular, like the poster's mini map).
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

# A handful of disputed / no-ISO territories Natural Earth marks "-99". Give
# them stable private-use codes so the base map is complete and they remain
# matchable (mostly by name) in the card config.
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
    """Ray-casting point-in-ring test."""
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
    """Inside the outer ring and outside every hole."""
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

    countries: list[dict] = []  # ordered; grid stores index+1
    polys: list[tuple[int, list, tuple]] = []  # (country_idx, rings, bbox)
    cont_totals = [0] * len(CONTINENTS)

    for feat in gj["features"]:
        props = feat["properties"]
        cont = props.get("CONTINENT")
        if cont not in CONT_INDEX:
            continue  # Antarctica, open ocean
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

    # grid[r][c] = country index + 1, or 0 for ocean.
    grid = [[0] * COLS for _ in range(ROWS)]
    for r in range(ROWS):
        lat = LAT_TOP - (r + 0.5) * DLAT
        for c in range(COLS):
            lon = LON0 + (c + 0.5) * DLON
            g = lon - 360.0 if lon > 180.0 else lon  # wrap into [-180, 180]
            for ci, rings, (x0, y0, x1, y1) in polys:
                if g < x0 or g > x1 or lat < y0 or lat > y1:
                    continue
                if polygon_contains(rings, g, lat):
                    grid[r][c] = ci + 1
                    countries[ci]["cells"] += 1
                    break

    # Give every zero-cell country a home on its label point's cell (or the
    # nearest free/ocean cell), so even the tiniest nation can light up.
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
        # Landlocked tinies with no free ocean cell nearby: take over the label
        # cell from a neighbour that can spare it (has more than one cell).
        if not placed and 0 <= cr < ROWS and 0 <= cc < COLS:
            owner = grid[cr][cc]
            if owner and countries[owner - 1]["cells"] > 1:
                countries[owner - 1]["cells"] -= 1
                grid[cr][cc] = ci + 1
                country["cells"] += 1
                placed = True
        if placed:
            forced += 1

    # Run-length encode the flat grid.
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
    lines.append("/* GENERATED by tools/gen_worldmap.py — do not edit by hand.")
    lines.append(" * Source: Natural Earth 110m admin-0 countries (public domain).")
    lines.append(" * Rasterised onto the world card's equirectangular dot grid. */")
    lines.append("")
    lines.append("export interface Country {")
    lines.append("  /** ISO 3166-1 alpha-2 (or a private-use code for disputed areas). */")
    lines.append("  iso2: string;")
    lines.append("  /** ISO 3166-1 alpha-3. */")
    lines.append("  iso3: string;")
    lines.append("  /** English country name. */")
    lines.append("  name: string;")
    lines.append("  /** Index into CONTINENTS. */")
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
        "/** Countries per continent present in the data (denominator for the meters). */"
    )
    lines.append(
        "export const CONTINENT_TOTALS: readonly number[] = ["
        + ", ".join(str(t) for t in cont_totals)
        + "];"
    )
    lines.append("")
    lines.append("/** Country table; the grid stores (index + 1), 0 = ocean. */")
    lines.append("export const COUNTRIES: readonly Country[] = [")
    for c in countries:
        lines.append(
            f'  {{ iso2: "{esc(c["iso2"])}", iso3: "{esc(c["iso3"])}", '
            f'name: "{esc(c["name"])}", cont: {c["cont"]} }},'
        )
    lines.append("];")
    lines.append("")
    lines.append(
        "/** Flat row-major grid, run-length encoded as [value, count, value, count, ...]. */"
    )
    lines.append("export const GRID_RLE: readonly number[] = [")
    # wrap the RLE numbers at ~20 pairs per line for readability
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
