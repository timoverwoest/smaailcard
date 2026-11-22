import { ADVANCE, GLYPH_H, GLYPH_W, glyph } from "./font";

export interface Dot {
  x: number;
  y: number;
}

/**
 * Voeg veel dots met dezelfde straal samen tot één SVG-path.
 *
 * De oorspronkelijke generator maakte één <circle> per dot, voor een vol bord
 * zo'n 5500 DOM-nodes. Een Lovelace-kaart tekent bij elke statuswijziging
 * opnieuw, dus voegen we dots van dezelfde kleur samen tot één <path> met
 * boogstukken: er ziet hetzelfde uit, met een paar nodes in plaats van duizenden.
 */
export function dotsPath(dots: Dot[], r: number): string {
  const d: string[] = [];
  for (const { x, y } of dots) {
    // Twee halve bogen vormen een hele cirkel rond (x, y).
    d.push(
      `M${(x - r).toFixed(2)} ${y.toFixed(2)}` +
        `a${r} ${r} 0 1 0 ${(r * 2).toFixed(2)} 0` +
        `a${r} ${r} 0 1 0 ${(-r * 2).toFixed(2)} 0`
    );
  }
  return d.join("");
}

/** Posities van de opgelichte dots voor `text`, vanaf (x0, y0) op een raster van `pitch`. */
export function textDots(
  x0: number,
  y0: number,
  pitch: number,
  text: string
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
 * Als `textDots`, maar afgekapt op een blok van `cols` dot-kolommen breed, zodat
 * een lange bestemming nooit in de jaartalkolom loopt.
 */
export function textDotsClipped(
  x0: number,
  y0: number,
  pitch: number,
  text: string,
  cols: number
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

/** Hoeveel tekens passen in een blok van `cols` dot-kolommen breed. */
export function maxChars(cols: number): number {
  return Math.max(0, Math.floor((cols + 1) / ADVANCE));
}
