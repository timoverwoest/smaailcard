import type { HomeAssistant } from "custom-card-helpers";
import { describe, expect, it } from "vitest";

import { editorLanguage, localize } from "../src/localize";

const hass = (language: string) => ({ language }) as HomeAssistant;

describe("editorLanguage", () => {
  it("uses Dutch only when Home Assistant is set to Dutch", () => {
    expect(editorLanguage(hass("nl"))).toBe("nl");
    expect(editorLanguage(hass("nl-BE"))).toBe("nl");
    expect(editorLanguage(hass("en"))).toBe("en");
    expect(editorLanguage(hass("de"))).toBe("en");
    expect(editorLanguage(undefined)).toBe("en");
  });
});

describe("localize", () => {
  it("gives the text in the chosen language", () => {
    expect(localize("en", "show_header")).toBe("Show header");
    expect(localize("nl", "show_header")).toBe("Kop tonen");
  });

  it("fills in placeholders", () => {
    expect(localize("en", "remove_row_n", { n: 2 })).toBe("Remove row 2");
    expect(localize("nl", "country_n", { n: 3 })).toBe("Land 3");
  });
});
