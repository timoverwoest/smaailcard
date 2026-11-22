import { COUNTRIES, CONTINENTS, CONTINENT_TOTALS } from "./worldmapdata";

/**
 * Maak van een landverwijzing een vergelijkbare sleutel: hoofdletters, accenten
 * weg (CÔTE D'IVOIRE -> COTE D IVOIRE) en alles wat geen letter of cijfer is
 * wordt één spatie. Zo komen ISO-codes, namen en rommelige invoer op dezelfde
 * vorm uit.
 */
export function normalizeKey(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/**
 * Gangbare namen en afkortingen die niet de ISO-code of de naam van Natural
 * Earth zijn, gekoppeld aan een ISO alpha-2 die in de data staat. Sleutels zijn
 * genormaliseerd. Vult alleen gaten: ISO-codes en de echte namen gaan voor.
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
  VATICAN: "VA", // niet in de 110m-data; wordt onbekend en zo gemeld
};

/** genormaliseerde sleutel -> landindex (vanaf 0 in COUNTRIES). Eén keer gebouwd. */
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
  /** Rasterwaarden vanaf 1 (landindex + 1) voor opgelichte cellen. */
  cells: Set<number>;
  /** Gevonden landindexen (vanaf 0), zonder dubbele. */
  indices: Set<number>;
  /** Aantal bezochte landen per werelddeel, in de volgorde van CONTINENTS. */
  perContinent: number[];
  /** Invoer die bij geen enkel land past. */
  unknown: string[];
  /** Aantal werelddelen met minstens één bezocht land. */
  continentsTouched: number;
}

/**
 * Zet een lijst landverwijzingen (ISO alpha-2/alpha-3, Engelse naam of bekende
 * alias) om in wat nodig is om de kaart op te lichten en de meters te vullen.
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
 * Lees een ruwe waarde uit de status of een attribuut van een entity als lijst
 * landverwijzingen. Een JSON-array mag, of tekst gescheiden door komma's,
 * puntkomma's, nieuwe regels of spaties.
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
      /* verder met splitsen op scheidingstekens */
    }
  }
  const parts = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // Eén reeks korte woorden met spaties (bijvoorbeeld "NL FR US") is een lijst
  // ISO-codes; langere woorden zijn één naam van meer woorden ("United States").
  if (parts.length === 1 && /\s/.test(parts[0])) {
    const tokens = parts[0].split(/\s+/);
    if (tokens.every((t) => t.length <= 3)) {
      return tokens;
    }
  }
  return parts;
}

export { CONTINENTS, CONTINENT_TOTALS };
