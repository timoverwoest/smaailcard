import { COUNTRIES, CONTINENTS, CONTINENT_TOTALS } from "./worldmapdata";

/**
 * Fold a country reference onto a comparable key: upper case, accents stripped
 * (CÔTE D'IVOIRE -> COTE DIVOIRE), and anything that is not a letter or digit
 * turned into a single space. Keeps ISO codes, plain names and messy user input
 * all landing on the same shape.
 */
export function normalizeKey(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/**
 * Common names and abbreviations that are not the ISO code or the Natural Earth
 * name, mapped onto an ISO alpha-2 the data actually carries. Keys are stored
 * normalized. Only fills gaps — ISO codes and the real names win first.
 */
const ALIASES: Record<string, string> = {
  USA: "US",
  "UNITED STATES OF AMERICA": "US",
  AMERICA: "US",
  UK: "GB",
  BRITAIN: "GB",
  "GREAT BRITAIN": "GB",
  ENGLAND: "GB",
  SCOTLAND: "GB",
  WALES: "GB",
  HOLLAND: "NL",
  UAE: "AE",
  RUSSIA: "RU",
  KOREA: "KR",
  "SOUTH KOREA": "KR",
  "NORTH KOREA": "KP",
  DPRK: "KP",
  LAOS: "LA",
  BRUNEI: "BN",
  "IVORY COAST": "CI",
  CZECHIA: "CZ",
  GAMBIA: "GM",
  ESWATINI: "SZ",
  SWAZILAND: "SZ",
  "EAST TIMOR": "TL",
  BURMA: "MM",
  TURKIYE: "TR",
  DRC: "CD",
  "DR CONGO": "CD",
  "CONGO KINSHASA": "CD",
  CONGO: "CG",
  "CONGO BRAZZAVILLE": "CG",
  MACEDONIA: "MK",
  BOSNIA: "BA",
  FALKLANDS: "FK",
  MALVINAS: "FK",
  "VATICAN": "VA", // not in the 110m data; resolves to unknown, listed as such
};

/** normalized key -> country index (0-based into COUNTRIES). Built once. */
let LOOKUP: Map<string, number> | null = null;

function lookup(): Map<string, number> {
  if (LOOKUP) {
    return LOOKUP;
  }
  const map = new Map<string, number>();
  COUNTRIES.forEach((c, i) => {
    for (const key of [c.iso2, c.iso3, c.name]) {
      const k = normalizeKey(key);
      if (k && !map.has(k)) {
        map.set(k, i);
      }
    }
  });
  const byIso2 = new Map(COUNTRIES.map((c, i) => [c.iso2, i]));
  for (const [alias, iso2] of Object.entries(ALIASES)) {
    const idx = byIso2.get(iso2);
    if (idx !== undefined && !map.has(alias)) {
      map.set(alias, idx);
    }
  }
  LOOKUP = map;
  return map;
}

export interface VisitedResult {
  /** 1-based grid values (country index + 1) for lit cells. */
  cells: Set<number>;
  /** Resolved country indices (0-based), de-duplicated. */
  indices: Set<number>;
  /** Visited count per continent, indexed like CONTINENTS. */
  perContinent: number[];
  /** Inputs that did not match any country. */
  unknown: string[];
  /** Number of continents with at least one visited country. */
  continentsTouched: number;
}

/**
 * Resolve a list of country references (ISO alpha-2/alpha-3, English name or a
 * known alias) into the data needed to light the map and fill the meters.
 */
export function resolveVisited(inputs: readonly string[]): VisitedResult {
  const map = lookup();
  const indices = new Set<number>();
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const raw of inputs) {
    const key = normalizeKey(String(raw ?? ""));
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    const idx = map.get(key);
    if (idx === undefined) {
      unknown.push(String(raw).trim());
    } else {
      indices.add(idx);
    }
  }

  const perContinent = new Array(CONTINENTS.length).fill(0);
  for (const idx of indices) {
    perContinent[COUNTRIES[idx].cont] += 1;
  }
  const cells = new Set<number>([...indices].map((i) => i + 1));
  const continentsTouched = perContinent.filter((n) => n > 0).length;

  return { cells, indices, perContinent, unknown, continentsTouched };
}

/**
 * Parse a raw value coming from an entity state or attribute into a list of
 * country references. Accepts a JSON array, or a comma / semicolon / newline /
 * space separated string.
 */
export function parseCountryList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }
  const text = String(value ?? "").trim();
  if (!text) {
    return [];
  }
  if (text.startsWith("[")) {
    try {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) {
        return arr.map((v) => String(v));
      }
    } catch {
      /* fall through to delimiter splitting */
    }
  }
  const parts = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // A single space-separated run of short tokens (e.g. "NL FR US") is a list of
  // ISO codes; longer tokens are treated as one multi-word name ("United States").
  if (parts.length === 1 && /\s/.test(parts[0])) {
    const tokens = parts[0].split(/\s+/);
    if (tokens.every((t) => t.length <= 3)) {
      return tokens;
    }
  }
  return parts;
}

export { CONTINENTS, CONTINENT_TOTALS };
