import { describe, expect, it } from "vitest";

import {
  CONTINENTS,
  normalizeKey,
  parseCountryList,
  resolveVisited,
} from "../src/countries";

describe("normalizeKey", () => {
  it("folds case, accents and punctuation onto one shape", () => {
    expect(normalizeKey("Côte d'Ivoire")).toBe("COTE D IVOIRE");
    expect(normalizeKey("  são-tomé ")).toBe("SAO TOME");
  });
});

describe("resolveVisited", () => {
  it("matches ISO-2, ISO-3, the name and an alias to the same country", () => {
    const result = resolveVisited(["NL", "NLD", "Netherlands", "holland"]);
    expect(result.indices.size).toBe(1);
    expect(result.unknown).toEqual([]);
  });

  it("counts countries and continents", () => {
    const result = resolveVisited(["NL", "BE", "JP", "US"]);
    expect(result.indices.size).toBe(4);
    expect(result.continentsTouched).toBe(3);
    expect(result.perContinent).toHaveLength(CONTINENTS.length);
    expect(result.perContinent.reduce((a, b) => a + b, 0)).toBe(4);
    // Cellen zijn landindexen vanaf 1, één per land.
    expect([...result.cells]).toEqual([...result.indices].map((i) => i + 1));
  });

  it("lists what it does not know, once, and skips empty input", () => {
    const result = resolveVisited(["Atlantis", "atlantis", "", "Vatican"]);
    expect(result.indices.size).toBe(0);
    expect(result.unknown).toEqual(["Atlantis", "Vatican"]);
  });
});

describe("parseCountryList", () => {
  it("accepts a list, a JSON array and separated text", () => {
    expect(parseCountryList(["NL", "BE"])).toEqual(["NL", "BE"]);
    expect(parseCountryList('["NL", "JP"]')).toEqual(["NL", "JP"]);
    expect(parseCountryList("NL, BE;JP\nUS")).toEqual(["NL", "BE", "JP", "US"]);
  });

  it("reads short space-separated tokens as codes, longer ones as one name", () => {
    expect(parseCountryList("NL FR USA")).toEqual(["NL", "FR", "USA"]);
    expect(parseCountryList("United States")).toEqual(["United States"]);
  });

  it("returns nothing for an empty state", () => {
    expect(parseCountryList(null)).toEqual([]);
    expect(parseCountryList("  ")).toEqual([]);
  });
});
