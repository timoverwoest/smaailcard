import { svg, type SVGTemplateResult } from "lit";

import {
  dotsPath,
  maxChars,
  textDots,
  textDotsClipped,
  type Dot,
} from "./dots";
import { GLYPH_H, normalizeText } from "./font";
import type { BoardRow, ResolvedConfig, SortOrder } from "./types";
import { worldMap } from "./worldmap";

/* ---------------------------------------------------------------- geometrie */
/* Al deze waarden komen rechtstreeks uit departures_board.py, zodat de kaart bij
   row_count = 9 precies gelijk is aan de originele poster. */
export const W = 1000;
export const H = 1414;

export const BG = "#0C0C0C";
export const YELLOW = "#F2DD00";
export const WHITE = "#FFFFFF";
export const GREY = "#C4C4C4";
export const DIM = "#3A3A3A";

const DEST_X = 70;
const DEST_COLS = 62;
const YEAR_COLS = 26;
const FULL_COLS = 96;
const PITCH = 9.0;
const RAD = 2.7;
const YEAR_X = 930 - (YEAR_COLS - 1) * PITCH;
const APOS_X = YEAR_X - 5 * PITCH - 12;
const ROW_Y0 = 232;
const ROW_STEP = 87;
const DESIGN_ROWS = 9;

/* Verticale ruimte van elk optioneel blok; daarmee sluit de kaart het gat dat
   het achterlaat als het uit staat. */
const HEADER_BLOCK = 111; // kopvlak + de ruimte tot de kolomkoppen
const LABEL_BLOCK = 46; // kolomkoppen + de ruimte tot de eerste regel
const LABELS_Y = 207;
const MAP_Y = 1105;
const MAP_PITCH = 3.4;
const MAP_ROWS = 22;
const MAP_COLS = 58;
const LEGEND_Y = 1108;
const LEGEND_PITCH = 2.85;
const FOOTER_BOTTOM = 1250;
const BOTTOM_MARGIN = 164; // marge van de poster onder de voetteksten
const PLAIN_MARGIN = 96; // marge als er niets onder de regels staat

const PLANE =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19" +
  "l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
const ARROW = "M100 0 L58 -36 L58 -15 L4 -15 L4 15 L58 15 L58 36 Z";

const LEGEND_LINES = ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ -. ", "0123456789"];

export const NAMED_COLORS: Record<string, string> = {
  yellow: YELLOW,
  white: WHITE,
  grey: GREY,
  gray: GREY,
};

export interface Layout {
  /** Verschuiving omhoog van de regels als kop en/of kolomkoppen verborgen zijn. */
  topShift: number;
  /** Verschuiving omhoog van voettekst, kaart en legenda. */
  bottomShift: number;
  /** Y van de basislijn van de kolomkoppen. */
  labelsY: number;
  /** Y van het eerste regelblok. */
  rowsY0: number;
  height: number;
}

/**
 * Bereken de verticale indeling van het bord. Elk optioneel blok dat uit staat,
 * geeft zijn ruimte terug, zodat de kaart nooit een groot leeg vlak toont. Bij
 * row_count 9 met alles aan is dat precies de 1000x1414 van de poster.
 */
export function layout(cfg: {
  row_count: number;
  show_header: boolean;
  show_column_labels: boolean;
  show_footer: boolean;
  show_map: boolean;
  show_legend: boolean;
}): Layout {
  const n = cfg.row_count;
  const headerShift = cfg.show_header ? 0 : HEADER_BLOCK;
  const topShift = headerShift + (cfg.show_column_labels ? 0 : LABEL_BLOCK);
  const bottomShift = (DESIGN_ROWS - n) * ROW_STEP + topShift;

  const rowsY0 = ROW_Y0 - topShift;
  const bottoms = [rowsY0 + (n - 1) * ROW_STEP + GLYPH_H * PITCH];
  if (cfg.show_map) {
    bottoms.push(MAP_Y + MAP_ROWS * MAP_PITCH - bottomShift);
  }
  if (cfg.show_legend) {
    bottoms.push(
      LEGEND_Y + 3 * 9 * LEGEND_PITCH + GLYPH_H * LEGEND_PITCH - bottomShift
    );
  }
  if (cfg.show_footer) {
    bottoms.push(FOOTER_BOTTOM - bottomShift);
  }
  const anyBottom = cfg.show_map || cfg.show_legend || cfg.show_footer;

  return {
    topShift,
    bottomShift,
    labelsY: LABELS_Y - headerShift,
    rowsY0,
    height: Math.round(
      Math.max(...bottoms) + (anyBottom ? BOTTOM_MARGIN : PLAIN_MARGIN)
    ),
  };
}

/* ------------------------------------------------------------------ hulpjes */

interface ResolvedRow {
  dest: string | null;
  year: string | null;
  color: string;
}

/** Kleur van een regel; anders de afwisselende standaard. */
function rowColor(row: BoardRow, index: number): string {
  const c = row.color;
  if (c) {
    return NAMED_COLORS[c.toLowerCase()] ?? c;
  }
  return index % 2 === 0 ? YELLOW : WHITE;
}

interface PendingRow {
  row: BoardRow;
  dest: string | null;
  year: string | null;
}

/** Vergelijk twee jaartallen als getal als dat kan, anders alfabetisch. */
function compareYears(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) {
    return na - nb;
  }
  return a.localeCompare(b);
}

/**
 * Orden de regels op jaartal.
 *
 * Alleen regels met een jaartal doen mee. Regels met een lege jaartalkolom en
 * regels over de volle breedte (zoals "WHAT'S NEXT?") hebben niets om op te
 * sorteren. Ze houden hun volgorde en komen na de gesorteerde regels, zodat een
 * afsluitende regel onderaan het bord blijft.
 */
function sortRows(rows: PendingRow[], order: SortOrder): PendingRow[] {
  if (order === "none") {
    return rows;
  }
  const dated: PendingRow[] = [];
  const undated: PendingRow[] = [];
  for (const row of rows) {
    (row.year ? dated : undated).push(row);
  }
  /* Array.sort is stabiel: regels met hetzelfde jaartal houden hun volgorde. */
  dated.sort((a, b) => {
    const cmp = compareYears(a.year as string, b.year as string);
    return order === "desc" ? -cmp : cmp;
  });
  return [...dated, ...undated];
}

/**
 * Zet de geconfigureerde regels om naar platte tekst: uit entities waar dat
 * gevraagd is, geordend op jaartal en afgekapt op wat in elk dot-matrixblok
 * past.
 *
 * Kleuren worden na het sorteren toegekend, zodat de standaard geel/wit-
 * afwisseling de volgorde op het bord volgt en niet die uit de configuratie.
 */
export function resolveRows(
  cfg: ResolvedConfig,
  states: Record<string, { state: string; attributes: Record<string, unknown> }>
): ResolvedRow[] {
  const pending: PendingRow[] = cfg.rows.map((row) => {
    let dest = row.dest ?? null;
    if (row.entity) {
      const st = states[row.entity];
      const raw = !st
        ? null
        : row.attribute
          ? st.attributes[row.attribute]
          : st.state;
      dest = raw === null || raw === undefined ? "" : String(raw);
    }

    let year = row.year === undefined ? null : row.year;
    if (row.year_entity) {
      const st = states[row.year_entity];
      const raw = !st
        ? null
        : row.year_attribute
          ? st.attributes[row.year_attribute]
          : st.state;
      year = raw === null || raw === undefined ? "" : String(raw);
    }

    return { row, dest, year };
  });

  return sortRows(pending, cfg.sort).map(({ row, dest, year }, i) => {
    const destCols = year === "" ? FULL_COLS : DEST_COLS;
    return {
      dest:
        dest === null ? null : normalizeText(dest).slice(0, maxChars(destCols)),
      year:
        year === null || year === ""
          ? year
          : normalizeText(year).slice(0, maxChars(YEAR_COLS)),
      color: rowColor(row, i),
    };
  });
}

/** Eén gedoofd dot-rasterblok: één rect gevuld met het dot-patroon. */
function grid(x0: number, y0: number, cols: number): SVGTemplateResult {
  return svg`<g transform="translate(${x0 - PITCH / 2} ${y0 - PITCH / 2})">
    <rect width=${cols * PITCH} height=${GLYPH_H * PITCH} fill="url(#sc-dim)"/>
  </g>`;
}

/* --------------------------------------------------------------------- bord */

export interface BuildOptions {
  /** Horizontale verschuiving die de kopgroep optisch centreert. */
  headerShift: number;
}

export function buildBoard(
  cfg: ResolvedConfig,
  rows: ResolvedRow[],
  opts: BuildOptions
): SVGTemplateResult {
  const rowCount = cfg.row_count;
  const { bottomShift: shift, labelsY, rowsY0, height } = layout(cfg);
  const accent = cfg.accent_color;
  const unlit = cfg.unlit_color;

  /* Opgelichte dots per kleur gebundeld, zodat elke kleur één <path> kost. */
  const lit = new Map<string, Dot[]>();
  const push = (color: string, dots: Dot[]) => {
    const bucket = lit.get(color);
    if (bucket) {
      bucket.push(...dots);
    } else {
      lit.set(color, [...dots]);
    }
  };

  const grids: SVGTemplateResult[] = [];

  for (let i = 0; i < rowCount; i++) {
    const y = rowsY0 + i * ROW_STEP;
    const row: ResolvedRow | undefined = rows[i];
    const dest = row?.dest ?? null;
    const year = row?.year ?? null;
    const color = row?.color ?? unlit;

    if (year === "") {
      grids.push(grid(DEST_X, y, FULL_COLS));
      if (dest) {
        push(color, textDotsClipped(DEST_X, y, PITCH, dest, FULL_COLS));
      }
      continue;
    }

    grids.push(grid(DEST_X, y, DEST_COLS));
    if (dest) {
      push(color, textDotsClipped(DEST_X, y, PITCH, dest, DEST_COLS));
    }
    /* Apostrof vóór het jaartal, gedoofd als er geen jaartal is. */
    push(year ? color : unlit, textDots(APOS_X, y, PITCH, "'"));
    grids.push(grid(YEAR_X, y, YEAR_COLS));
    if (year) {
      push(color, textDotsClipped(YEAR_X, y, PITCH, year, YEAR_COLS));
    }
  }

  /* Mini-wereldkaart. */
  let mapPaths: SVGTemplateResult[] = [];
  if (cfg.show_map) {
    const { land, pin } = worldMap(
      540,
      MAP_Y - shift,
      MAP_COLS,
      MAP_ROWS,
      MAP_PITCH,
      cfg.pin
    );
    mapPaths = [
      svg`<path d=${dotsPath(land, 1.35)} fill="#575757"/>`,
      ...(pin
        ? [
            svg`<circle cx=${pin.x} cy=${pin.y} r=${1.35 * 1.9} fill=${accent}/>`,
          ]
        : []),
    ];
  }

  /* Legenda met de tekenset. */
  let legendPath = "";
  if (cfg.show_legend) {
    const lp = LEGEND_PITCH;
    const dots: Dot[] = [];
    LEGEND_LINES.forEach((line, k) => {
      dots.push(...textDots(761, LEGEND_Y + k * 9 * lp - shift, lp, line));
    });
    legendPath = dotsPath(dots, 1.15);
  }

  return svg`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${W} ${height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${cfg.title}: ${rows
        .filter((r) => r.dest)
        .map((r) => [r.dest, r.year].filter(Boolean).join(" "))
        .join(", ")}`}
    >
      <defs>
        <pattern
          id="sc-dim"
          width=${PITCH}
          height=${PITCH}
          patternUnits="userSpaceOnUse"
        >
          <circle cx=${PITCH / 2} cy=${PITCH / 2} r=${RAD} fill=${unlit}/>
        </pattern>
      </defs>

      <rect width=${W} height=${height} fill=${cfg.background_color}/>

      ${
        cfg.show_header
          ? svg`<g id="sc-header" transform="translate(${opts.headerShift} 0)">
            <rect x="228" y="96" width="60" height="60" rx="14" fill=${accent}/>
            <g transform="translate(258,126) scale(1.55) rotate(45) translate(-12,-12)">
              <path d=${PLANE} fill=${cfg.background_color}/>
            </g>
            <text x="306" y="148" font-size="62" font-weight="700"
                  letter-spacing="1.5" fill=${WHITE}>${cfg.title}</text>
          </g>`
          : ""
      }

      ${
        cfg.show_column_labels
          ? svg`
            <text x=${DEST_X} y=${labelsY} font-size="25" letter-spacing="2.5"
                  fill=${GREY}>${cfg.dest_label}</text>
            <text x="930" y=${labelsY} font-size="25" letter-spacing="2.5"
                  text-anchor="end" fill=${GREY}>${cfg.year_label}</text>`
          : ""
      }

      ${grids}
      ${[...lit.entries()].map(
        ([color, dots]) => svg`<path d=${dotsPath(dots, RAD)} fill=${color}/>`
      )}

      ${
        cfg.show_footer
          ? svg`
            <g transform="translate(122,${1128 - shift}) rotate(-135) scale(0.46)">
              <path d=${ARROW} fill=${accent}/>
            </g>
            <text x="185" y=${1130 - shift} font-size="30" font-weight="600"
                  fill=${WHITE}>${cfg.footer_title}</text>
            <text x="185" y=${1152 - shift} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${cfg.footer_subtitle}</text>

            <g transform="translate(98,${1210 - shift}) scale(0.46)">
              <path d=${ARROW} fill=${accent}/>
            </g>
            <text x="185" y=${1218 - shift} font-size="30" font-weight="600"
                  fill=${WHITE}>${cfg.footer2_title}</text>
            <text x="185" y=${1240 - shift} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${cfg.footer2_subtitle}</text>`
          : ""
      }

      ${mapPaths}
      ${legendPath ? svg`<path d=${legendPath} fill=${accent}/>` : ""}
    </svg>
  `;
}
