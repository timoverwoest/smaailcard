/**
 * 5x7 dot-matrix-lettertype, letterlijk overgenomen uit de oorspronkelijke
 * generator departures_board.py, zodat het bord teken voor teken gelijk is aan
 * de poster.
 *
 * Elk teken is 7 rijen van 5 bits, "1" = opgelichte dot.
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
 * Telefoons en Macs vervangen getypte leestekens stilletjes door typografische
 * varianten (een rechte ' wordt een gekrulde ’). Die hebben hier geen teken en
 * zouden als spatie verschijnen. Zet ze om naar tekens die het bord wel kan
 * tekenen.
 */
const PUNCTUATION: Record<string, string> = {
  "‘": "'", // ‘ enkel aanhalingsteken links
  "’": "'", // ’ enkel aanhalingsteken rechts (wat iOS/macOS typt)
  "‛": "'", // ‛ omgekeerd
  ʼ: "'", // ʼ apostrof als letterteken
  "´": "'", // ´ accent aigu gebruikt als apostrof
  "′": "'", // ′ accent (prime)
  "–": "-", // – kort gedachtestreepje
  "—": "-", // — lang gedachtestreepje
  "‐": "-", // ‐ koppelteken
  "‑": "-", // ‑ vast koppelteken
  "−": "-", // − minteken
  "…": "...", // … beletselteken
  " ": " ", // vaste spatie
};

/** Letters die Unicode niet ontleedt; die worden uitgeschreven. */
const LETTERS: Record<string, string> = {
  Ø: "O",
  Æ: "AE",
  Œ: "OE",
  Þ: "TH",
  Ð: "D",
  Đ: "D",
  Ł: "L",
  ı: "I", // ı i zonder punt
};

/**
 * Breng tekst terug tot de tekenset van het bord: hoofdletters, accenten weg
 * (MÁLAGA -> MALAGA, ZÜRICH -> ZURICH) en typografische leestekens vervangen
 * door hun gewone variant. Wat dan nog niet kan, wordt een lege cel.
 */
export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD") // letters met accent splitsen in letter + combinatieteken
    .replace(/[\u0300-\u036f]/g, "") // tekens weg, de letter blijft
    .split("")
    .map((ch) => PUNCTUATION[ch] ?? LETTERS[ch] ?? ch)
    .join("");
}

/** Celgrootte van een teken en horizontale stap, in dot-kolommen. */
export const GLYPH_W = 5;
export const GLYPH_H = 7;
export const ADVANCE = 6;

/** Rijen van een teken; onbekende tekens worden een lege cel. */
export function glyph(ch: string): string[] {
  return (FONT[ch.toUpperCase()] ?? FONT[" "]).split(" ");
}

/** Tekens die het bord echt kan tonen. */
export const SUPPORTED = Object.keys(FONT).join("");

/** Breedte van `text` in dot-kolommen (na het laatste teken geen tussenruimte). */
export function textCols(text: string): number {
  return text.length === 0 ? 0 : text.length * ADVANCE - 1;
}
