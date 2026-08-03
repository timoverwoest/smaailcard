/**
 * 5x7 dot-matrix font, ported verbatim from the original departures_board.py
 * generator so the rendered board is glyph-for-glyph identical to the poster.
 *
 * Each entry is 7 rows of 5 bits, "1" = lit dot.
 */
export const FONT: Record<string, string> = {
  A: "01110 10001 10001 11111 10001 10001 10001",
  B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110",
  D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111",
  F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111",
  H: "10001 10001 10001 11111 10001 10001 10001",
  I: "11111 00100 00100 00100 00100 00100 11111",
  J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001",
  L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001",
  N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
  P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101",
  R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110",
  T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110",
  V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001",
  X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100",
  Z: "11111 00001 00010 00100 01000 10000 11111",
  "0": "01110 10001 10011 10101 11001 10001 01110",
  "1": "00100 01100 00100 00100 00100 00100 01110",
  "2": "01110 10001 00001 00010 00100 01000 11111",
  "3": "11111 00010 00100 00010 00001 10001 01110",
  "4": "00010 00110 01010 10010 11111 00010 00010",
  "5": "11111 10000 11110 00001 00001 10001 01110",
  "6": "00110 01000 10000 11110 10001 10001 01110",
  "7": "11111 00001 00010 00100 01000 01000 01000",
  "8": "01110 10001 10001 01110 10001 10001 01110",
  "9": "01110 10001 10001 01111 00001 00010 01100",
  " ": "00000 00000 00000 00000 00000 00000 00000",
  "-": "00000 00000 00000 11111 00000 00000 00000",
  ".": "00000 00000 00000 00000 00000 01100 01100",
  "?": "01110 10001 00001 00010 00100 00000 00100",
  "'": "00100 00100 01000 00000 00000 00000 00000",
};

/*
 * Phones and Macs silently replace typed punctuation with typographic
 * variants — a straight ' becomes a curly ’ — and none of those have a glyph
 * here, so they would render as a blank. Map them onto the characters the
 * board can actually draw.
 */
const PUNCTUATION: Record<string, string> = {
  "‘": "'", // ‘ left single quote
  "’": "'", // ’ right single quote (what iOS/macOS types)
  "‛": "'", // ‛ reversed
  "ʼ": "'", // ʼ modifier letter apostrophe
  "´": "'", // ´ acute accent used as apostrophe
  "′": "'", // ′ prime
  "–": "-", // – en dash
  "—": "-", // — em dash
  "‐": "-", // ‐ hyphen
  "‑": "-", // ‑ non-breaking hyphen
  "−": "-", // − minus
  "…": "...", // … ellipsis
  " ": " ", // non-breaking space
};

/** Letters that Unicode decomposition leaves alone, spelled out instead. */
const LETTERS: Record<string, string> = {
  Ø: "O",
  Æ: "AE",
  Œ: "OE",
  Þ: "TH",
  Ð: "D",
  Đ: "D",
  Ł: "L",
  "ı": "I", // ı dotless i
};

/**
 * Fold text onto the board's character set: upper case, accents stripped
 * (MÁLAGA -> MALAGA, ZÜRICH -> ZURICH) and typographic punctuation replaced by
 * its plain equivalent. Anything still unsupported ends up as a blank cell.
 */
export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD") // split accented letters into letter + combining mark
    .replace(/[̀-ͯ]/g, "") // drop the marks, keep the base letter
    .split("")
    .map((ch) => PUNCTUATION[ch] ?? LETTERS[ch] ?? ch)
    .join("");
}

/** Glyph cell size and horizontal advance, in dot columns. */
export const GLYPH_W = 5;
export const GLYPH_H = 7;
export const ADVANCE = 6;

/** Rows of a glyph; unsupported characters fall back to a blank cell. */
export function glyph(ch: string): string[] {
  return (FONT[ch.toUpperCase()] ?? FONT[" "]).split(" ");
}

/** Characters the board can actually display. */
export const SUPPORTED = Object.keys(FONT).join("");

/** Width in dot columns that `text` occupies (last glyph has no trailing gap). */
export function textCols(text: string): number {
  return text.length === 0 ? 0 : text.length * ADVANCE - 1;
}
