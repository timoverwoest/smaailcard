import { svg, type SVGTemplateResult } from "lit";

import { dotsPath, type Dot } from "./dots";
import type { ResolvedWorldConfig } from "./types";
import {
  COLS,
  ROWS,
  CONTINENTS,
  CONTINENT_TOTALS,
  COUNTRIES,
  GRID_RLE,
} from "./worldmapdata";
import type { VisitedResult } from "./countries";

/* ------------------------------------------------------------------ palette */
export const W = 1000;
export const BG = "#0C0C0C";
export const YELLOW = "#F2DD00";
export const LAND = "#3A3A3A";
export const WHITE = "#FFFFFF";
export const GREY = "#8C8C8C";

/* ----------------------------------------------------------------- geometry */
const MARGIN = 48;

/* Header. */
const HEADER_Y = 42;
const LOGO = 66;
const LOGO_X = 300;
const TITLE_SIZE = 52;

/* Main map. */
const MAP_PITCH = 9.0;
const MAP_R = 2.7;
const MAP_W = (COLS - 1) * MAP_PITCH;
const MAP_X0 = Math.round((W - MAP_W) / 2); // centre of the first dot column
const HEADER_BLOCK = 150; // header height reclaimed when it is hidden

/* Continent meters. */
const MET_PITCH = 6.6;
const MET_R = 2.0;
const MET_ROWS = 4;
const LABEL_SIZE = 13;
const GAP_IN = 26; // between meters in a group
const METER_GAP = 46; // map -> meters
const LABEL_DROP = 18; // label baseline -> first grid row

/* Centre overview map. */
const OVERVIEW_MAX_W = 210;
const CAPTION_SIZE = 15;

/* A simple globe drawn in the background colour on the accent logo square. */
function globe(cx: number, cy: number, r: number, colour: string): SVGTemplateResult {
  const sw = r * 0.13;
  return svg`
    <g fill="none" stroke=${colour} stroke-width=${sw}>
      <circle cx=${cx} cy=${cy} r=${r} />
      <ellipse cx=${cx} cy=${cy} rx=${r * 0.42} ry=${r} />
      <line x1=${cx - r} y1=${cy} x2=${cx + r} y2=${cy} />
      <path d=${`M${cx - r * 0.86} ${cy - r * 0.5} Q ${cx} ${cy - r * 0.28} ${cx + r * 0.86} ${cy - r * 0.5}`} />
      <path d=${`M${cx - r * 0.86} ${cy + r * 0.5} Q ${cx} ${cy + r * 0.28} ${cx + r * 0.86} ${cy + r * 0.5}`} />
    </g>`;
}

/* Decode the run-length-encoded grid to a flat row-major array, once. */
let FLAT: number[] | null = null;
function flatGrid(): number[] {
  if (FLAT) {
    return FLAT;
  }
  const f: number[] = [];
  for (let i = 0; i < GRID_RLE.length; i += 2) {
    const v = GRID_RLE[i];
    for (let n = GRID_RLE[i + 1]; n > 0; n--) {
      f.push(v);
    }
  }
  FLAT = f;
  return f;
}

/** Grid columns needed for a meter of `total` cells at MET_ROWS rows. */
function meterCols(total: number): number {
  return Math.max(1, Math.ceil(total / MET_ROWS));
}

/** Rough width (px) of a Helvetica-caps label at LABEL_SIZE. */
function labelWidth(text: string): number {
  return text.length * LABEL_SIZE * 0.62;
}

function meterWidth(k: number): number {
  const grid = meterCols(CONTINENT_TOTALS[k]) * MET_PITCH;
  return Math.max(grid, labelWidth(CONTINENTS[k].toUpperCase()));
}

/* One continent meter: an upper-case label over a `total`-cell dot grid with
   the first `visited` cells lit. Returns dim + accent dots and the label. */
function meter(
  k: number,
  x: number,
  yLabel: number,
  yGrid: number,
  visited: number,
  push: (accent: boolean, dots: Dot[]) => void,
): SVGTemplateResult {
  const total = CONTINENT_TOTALS[k];
  const cols = meterCols(total);
  for (let i = 0; i < total; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    push(i < visited, [{ x: x + c * MET_PITCH, y: yGrid + r * MET_PITCH }]);
  }
  return svg`<text x=${x} y=${yLabel} font-size=${LABEL_SIZE}
    letter-spacing="0.5" fill=${GREY}>${CONTINENTS[k].toUpperCase()}</text>`;
}

export interface WorldLayout {
  height: number;
}

/** Work out the card height for the given toggles (used for grid sizing). */
export function worldLayout(cfg: {
  show_header: boolean;
  show_meters: boolean;
  show_overview: boolean;
  show_stats: boolean;
}): WorldLayout {
  const mapY0 = cfg.show_header ? HEADER_BLOCK + (cfg.show_stats ? 22 : 0) : 56;
  const mapBottom = mapY0 + (ROWS - 1) * MAP_PITCH + MAP_R;
  let bottom = mapBottom + 40;
  if (cfg.show_meters) {
    bottom = mapBottom + METER_GAP + LABEL_DROP + MET_ROWS * MET_PITCH;
    if (cfg.show_overview) {
      bottom += CAPTION_SIZE + 6; // caption sits a touch lower than the meters
    }
  }
  return { height: Math.round(bottom + 44) };
}

export interface WorldBuildOptions {
  headerShift: number;
}

export function buildWorldBoard(
  cfg: ResolvedWorldConfig,
  visited: VisitedResult,
  totalVisited: number,
  opts: WorldBuildOptions,
): SVGTemplateResult {
  const accent = cfg.accent_color;
  const land = cfg.land_color;
  const bg = cfg.background_color;
  const { height } = worldLayout(cfg);

  const mapY0 = cfg.show_header ? HEADER_BLOCK + (cfg.show_stats ? 22 : 0) : 56;
  const flat = flatGrid();

  /* Main map: unvisited land dim, visited land accent. */
  const dim: Dot[] = [];
  const lit: Dot[] = [];
  for (let i = 0; i < flat.length; i++) {
    const v = flat[i];
    if (!v) {
      continue;
    }
    const dot = {
      x: MAP_X0 + (i % COLS) * MAP_PITCH,
      y: mapY0 + Math.floor(i / COLS) * MAP_PITCH,
    };
    (visited.cells.has(v) ? lit : dim).push(dot);
  }

  /* Footer: continent meters (3 left, 3 right) flanking an overview map. */
  const metLabels: SVGTemplateResult[] = [];
  const metDim: Dot[] = [];
  const metLit: Dot[] = [];
  const overviewDots: { dim: Dot[]; lit: Dot[] } = { dim: [], lit: [] };
  let caption: SVGTemplateResult | "" = "";

  if (cfg.show_meters) {
    const mapBottom = mapY0 + (ROWS - 1) * MAP_PITCH + MAP_R;
    const yLabel = mapBottom + METER_GAP;
    const yGrid = yLabel + LABEL_DROP;
    const push = (isLit: boolean, dots: Dot[]) =>
      (isLit ? metLit : metDim).push(...dots);

    const left = [0, 1, 2];
    const right = [3, 4, 5];

    let x = MARGIN;
    for (const k of left) {
      metLabels.push(meter(k, x, yLabel, yGrid, visited.perContinent[k], push));
      x += meterWidth(k) + GAP_IN;
    }
    const leftEnd = x - GAP_IN;

    const rightWidth =
      right.reduce((s, k) => s + meterWidth(k), 0) + GAP_IN * (right.length - 1);
    let rx = W - MARGIN - rightWidth;
    const rightStart = rx;
    for (const k of right) {
      metLabels.push(meter(k, rx, yLabel, yGrid, visited.perContinent[k], push));
      rx += meterWidth(k) + GAP_IN;
    }

    /* Overview map centred in the gap between the two groups. */
    if (cfg.show_overview) {
      const avail = rightStart - leftEnd - 40;
      const pitch = Math.max(
        1.2,
        Math.min(OVERVIEW_MAX_W, avail) / (COLS - 1),
      );
      const ovW = (COLS - 1) * pitch;
      const ovX = (leftEnd + rightStart) / 2 - ovW / 2;
      const ovY = yLabel - 6;
      for (let i = 0; i < flat.length; i++) {
        const v = flat[i];
        if (!v) {
          continue;
        }
        const dot = {
          x: ovX + (i % COLS) * pitch,
          y: ovY + Math.floor(i / COLS) * pitch,
        };
        (visited.cells.has(v) ? overviewDots.lit : overviewDots.dim).push(dot);
      }
      if (cfg.caption) {
        caption = svg`<text x=${(leftEnd + rightStart) / 2}
          y=${ovY + ROWS * pitch + CAPTION_SIZE + 2} font-size=${CAPTION_SIZE}
          letter-spacing="2" text-anchor="middle" fill=${GREY}>${cfg.caption}</text>`;
      }
    }
  }

  const statsText = `${totalVisited} ${totalVisited === 1 ? "COUNTRY" : "COUNTRIES"} · ${visited.continentsTouched}/${CONTINENTS.length} CONTINENTS`;
  const ariaVisited = [...visited.indices].map((i) => COUNTRIES[i].name).sort();

  return svg`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${W} ${height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${cfg.title}: ${totalVisited} countries visited${ariaVisited.length ? " — " + ariaVisited.join(", ") : ""}`}
    >
      <rect width=${W} height=${height} fill=${bg} />

      ${cfg.show_header
        ? svg`<g id="swc-header" transform="translate(${opts.headerShift} 0)">
            <rect x=${LOGO_X} y=${HEADER_Y} width=${LOGO} height=${LOGO} rx="15" fill=${accent}/>
            ${globe(LOGO_X + LOGO / 2, HEADER_Y + LOGO / 2, LOGO * 0.34, bg)}
            <text x=${LOGO_X + LOGO + 22} y=${HEADER_Y + LOGO * 0.74}
                  font-size=${TITLE_SIZE} font-weight="700" letter-spacing="2"
                  fill=${WHITE}>${cfg.title}</text>
          </g>`
        : ""}

      ${cfg.show_header && cfg.show_stats
        ? svg`<text x=${W / 2} y=${HEADER_Y + LOGO + 30} font-size="16"
              letter-spacing="3" text-anchor="middle" fill=${accent}>${statsText}</text>`
        : ""}

      <path d=${dotsPath(dim, MAP_R)} fill=${land}/>
      <path d=${dotsPath(lit, MAP_R)} fill=${accent}/>

      ${overviewDots.dim.length
        ? svg`<path d=${dotsPath(overviewDots.dim, MET_R * 0.62)} fill=${land} opacity="0.7"/>`
        : ""}
      ${overviewDots.lit.length
        ? svg`<path d=${dotsPath(overviewDots.lit, MET_R * 0.62)} fill=${accent}/>`
        : ""}
      ${caption}

      ${metLabels}
      <path d=${dotsPath(metDim, MET_R)} fill=${land}/>
      <path d=${dotsPath(metLit, MET_R)} fill=${accent}/>
    </svg>
  `;
}
