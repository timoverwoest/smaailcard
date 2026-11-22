import { describe, expect, it } from "vitest";

import { maxChars, textDots, textDotsClipped } from "../src/dots";
import { ADVANCE, normalizeText } from "../src/font";

describe("normalizeText", () => {
  it("uses upper case and strips accents", () => {
    expect(normalizeText("Málaga")).toBe("MALAGA");
    expect(normalizeText("Zürich")).toBe("ZURICH");
    expect(normalizeText("Reykjavík")).toBe("REYKJAVIK");
  });

  it("spells out letters that Unicode does not decompose", () => {
    expect(normalizeText("Tromsø")).toBe("TROMSO");
    expect(normalizeText("Ærø")).toBe("AERO");
    expect(normalizeText("Þingvellir")).toBe("THINGVELLIR");
  });

  it("straightens typographic punctuation", () => {
    expect(normalizeText("What’s next…")).toBe("WHAT'S NEXT...");
    expect(normalizeText("A–B—C")).toBe("A-B-C");
  });
});

describe("dots", () => {
  it("fits 10, 4 and 16 characters in the board's blocks", () => {
    expect(maxChars(62)).toBe(10);
    expect(maxChars(26)).toBe(4);
    expect(maxChars(96)).toBe(16);
  });

  it("never draws past the block it is clipped to", () => {
    const cols = 2 * ADVANCE;
    const dots = textDotsClipped(0, 0, 1, "WWWWWW", cols);
    expect(dots.length).toBeGreaterThan(0);
    expect(Math.max(...dots.map((d) => d.x))).toBeLessThan(cols);
    expect(dots.length).toBeLessThan(textDots(0, 0, 1, "WWWWWW").length);
  });

  it("draws a blank cell for a space", () => {
    expect(textDots(0, 0, 1, " ")).toEqual([]);
  });
});
