import { describe, expect, it } from "vitest";

import { BOARD_DEFAULTS, withoutUnchangedDefaults } from "../src/defaults";

describe("withoutUnchangedDefaults", () => {
  it("leaves out defaults the editor only showed", () => {
    const previous = { type: "custom:smaail-card" };
    const next = { ...BOARD_DEFAULTS, ...previous, title: "TRAVELS" };
    expect(withoutUnchangedDefaults(next, previous, BOARD_DEFAULTS)).toEqual({
      type: "custom:smaail-card",
      title: "TRAVELS",
    });
  });

  it("keeps a default value that was already in the config", () => {
    const previous = { type: "custom:smaail-card", show_header: true };
    const next = { ...BOARD_DEFAULTS, ...previous };
    expect(
      withoutUnchangedDefaults(next, previous, BOARD_DEFAULTS).show_header
    ).toBe(true);
  });

  it("keeps a changed value", () => {
    const previous = { type: "custom:smaail-card" };
    const next = { ...BOARD_DEFAULTS, show_map: false };
    expect(
      withoutUnchangedDefaults(next, previous, BOARD_DEFAULTS).show_map
    ).toBe(false);
  });
});
