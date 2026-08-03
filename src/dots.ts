import { ADVANCE, GLYPH_H, GLYPH_W, glyph } from "./font";

export interface Dot {
  x: number;
  y: number;
}

/**
 * Collapse many equal-radius dots into a single SVG path.
 *
 * The original generator emitted one <circle> per dot, which for a full board
 * is ~5500 DOM nodes. A Lovelace card re-renders on every state change, so we
 * merge same-coloured dots into one <path> of arc subpaths instead — visually
 * identical, but a couple of nodes instead of thousands.
 */
export function dotsPath(dots: Dot[], r: number): string {
  const d: string[] = [];
  for (const { x, y } of dots) {
    // Two half-arcs form a full circle centred on (x, y).
    d.push(
      `M${(x - r).toFixed(2)} ${y.toFixed(2)}` +
        `a${r} ${r} 0 1 0 ${(r * 2).toFixed(2)} 0` +
        `a${r} ${r} 0 1 0 ${(-r * 2).toFixed(2)} 0`,
    );
  }
  return d.join("");
}

/** Lit dot positions for `text`, laid out from (x0, y0) on a `pitch` grid. */
export function textDots(
  x0: number,
  y0: number,
  pitch: number,
  text: string,
): Dot[] {
  const dots: Dot[] = [];
  let cx = 0;
  for (const ch of text) {
    const g = glyph(ch);
    for (let ry = 0; ry < GLYPH_H; ry++) {
      for (let rx = 0; rx < GLYPH_W; rx++) {
        if (g[ry][rx] === "1") {
          dots.push({ x: x0 + (cx + rx) * pitch, y: y0 + ry * pitch });
        }
      }
    }
    cx += ADVANCE;
  }
  return dots;
}

/**
 * Same as `textDots`, but clipped to a block `cols` dot-columns wide so a long
 * destination can never bleed into the year column.
 */
export function textDotsClipped(
  x0: number,
  y0: number,
  pitch: number,
  text: string,
  cols: number,
): Dot[] {
  const dots: Dot[] = [];
  let cx = 0;
  for (const ch of text) {
    if (cx >= cols) break;
    const g = glyph(ch);
    for (let ry = 0; ry < GLYPH_H; ry++) {
      for (let rx = 0; rx < GLYPH_W; rx++) {
        if (g[ry][rx] === "1" && cx + rx < cols) {
          dots.push({ x: x0 + (cx + rx) * pitch, y: y0 + ry * pitch });
        }
      }
    }
    cx += ADVANCE;
  }
  return dots;
}

/** How many characters fit in a block `cols` dot-columns wide. */
export function maxChars(cols: number): number {
  return Math.max(0, Math.floor((cols + 1) / ADVANCE));
}
