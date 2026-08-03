# tools

Build-time helpers. Not shipped in the card bundle.

## `gen_worldmap.py`

Regenerates [`src/worldmapdata.ts`](../src/worldmapdata.ts) — the per-country
dot grid the **world map card** (`custom:smaail-world-card`) draws.

It rasterises [Natural Earth](https://www.naturalearthdata.com/) 110m admin-0
countries (public domain) onto the card's equirectangular dot grid: for every
cell it works out which country covers the cell centre, then emits a compact,
run-length-encoded module with the grid, the country table (ISO alpha-2/alpha-3,
name, continent) and the per-continent totals.

```bash
# 1. Fetch the source dataset (~0.8 MB, not vendored — see .gitignore)
curl -sSL -o tools/ne_110m.geojson \
  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson

# 2. Regenerate src/worldmapdata.ts (pure standard-library Python 3)
python3 tools/gen_worldmap.py
```

Tuning the grid resolution or window (the `COLS`, `LAT_TOP`, … constants at the
top of the script) changes how detailed the map is; re-run to regenerate. At the
current 100×40 grid a few of the very smallest nations get their Natural Earth
label point forced onto a free cell so they can still light up; the script
prints any that remain too small to place.
