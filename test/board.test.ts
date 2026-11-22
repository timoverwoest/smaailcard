import { describe, expect, it } from "vitest";

import { GREY, WHITE, YELLOW, layout, resolveRows } from "../src/board";
import { BOARD_DEFAULTS } from "../src/defaults";
import type { BoardRow, ResolvedConfig, SortOrder } from "../src/types";

type States = Parameters<typeof resolveRows>[1];

function config(rows: BoardRow[], sort: SortOrder = "asc"): ResolvedConfig {
  return {
    ...BOARD_DEFAULTS,
    type: "custom:smaail-card",
    rows,
    sort,
  } as ResolvedConfig;
}

const ALL_ON = {
  row_count: 9,
  show_header: true,
  show_column_labels: true,
  show_footer: true,
  show_map: true,
  show_legend: true,
};

describe("resolveRows", () => {
  it("sorts by year, oldest first, with undated rows below in their own order", () => {
    const rows = resolveRows(
      config([
        { dest: "TOKYO", year: "2019" },
        { dest: "WHAT'S NEXT?", year: "" },
        { dest: "NEW YORK", year: "1997" },
        { dest: "SOMEDAY" },
        { dest: "MADRID", year: "2000" },
      ]),
      {}
    );
    expect(rows.map((r) => r.dest)).toEqual([
      "NEW YORK",
      "MADRID",
      "TOKYO",
      "WHAT'S NEXT?",
      "SOMEDAY",
    ]);
  });

  it("sorts newest first with sort: desc", () => {
    const rows = resolveRows(
      config(
        [
          { dest: "A", year: "1997" },
          { dest: "B", year: "2019" },
        ],
        "desc"
      ),
      {}
    );
    expect(rows.map((r) => r.dest)).toEqual(["B", "A"]);
  });

  it("keeps the configured order with sort: none", () => {
    const rows = resolveRows(
      config(
        [
          { dest: "B", year: "2019" },
          { dest: "A", year: "1997" },
        ],
        "none"
      ),
      {}
    );
    expect(rows.map((r) => r.dest)).toEqual(["B", "A"]);
  });

  it("puts years that are not numbers after the numeric ones, alphabetically", () => {
    const rows = resolveRows(
      config([
        { dest: "C", year: "SOON" },
        { dest: "B", year: "2019" },
        { dest: "A", year: "LATER" },
      ]),
      {}
    );
    expect(rows.map((r) => r.year)).toEqual(["2019", "LATER", "SOON"]);
  });

  it("keeps rows with the same year in configured order", () => {
    const rows = resolveRows(
      config([
        { dest: "FIRST", year: "2000" },
        { dest: "SECOND", year: "2000" },
      ]),
      {}
    );
    expect(rows.map((r) => r.dest)).toEqual(["FIRST", "SECOND"]);
  });

  it("alternates yellow and white in board order, and keeps an own colour", () => {
    const rows = resolveRows(
      config([
        { dest: "C", year: "2003" },
        { dest: "A", year: "2001", color: "grey" },
        { dest: "B", year: "2002" },
        { dest: "D", year: "2004", color: "#FF8800" },
      ]),
      {}
    );
    expect(rows.map((r) => r.color)).toEqual([GREY, WHITE, YELLOW, "#FF8800"]);
  });

  it("takes the destination and year from entities", () => {
    const states: States = {
      "sensor.trip": { state: "Lisboa", attributes: { city: "Porto" } },
      "sensor.year": { state: "2026", attributes: {} },
    };
    const rows = resolveRows(
      config([
        { entity: "sensor.trip", year_entity: "sensor.year" },
        { entity: "sensor.trip", attribute: "city", year: "2025" },
        { entity: "sensor.missing", year: "2024" },
      ]),
      states
    );
    expect(rows.map((r) => [r.dest, r.year])).toEqual([
      ["", "2024"],
      ["PORTO", "2025"],
      ["LISBOA", "2026"],
    ]);
  });

  it("cuts text to what fits: 10 characters, 16 full width, 4 for the year", () => {
    const rows = resolveRows(
      config(
        [
          { dest: "VERY LONG DESTINATION", year: "199712" },
          { dest: "A FULL WIDTH LINE OF TEXT", year: "" },
        ],
        "none"
      ),
      {}
    );
    expect(rows[0].dest).toBe("VERY LONG ");
    expect(rows[0].year).toBe("1997");
    expect(rows[1].dest).toBe("A FULL WIDTH LIN");
  });
});

describe("layout", () => {
  it("gives the poster size with 9 rows and every block on", () => {
    expect(layout(ALL_ON).height).toBe(1414);
  });

  it("closes the gap of hidden blocks", () => {
    const plain = layout({
      ...ALL_ON,
      show_footer: false,
      show_map: false,
      show_legend: false,
    });
    expect(plain.height).toBe(1087);

    const noHeader = layout({ ...ALL_ON, show_header: false });
    expect(noHeader.rowsY0).toBeLessThan(layout(ALL_ON).rowsY0);
    expect(noHeader.height).toBeLessThan(1414);
  });

  it("grows with more rows", () => {
    expect(layout({ ...ALL_ON, row_count: 12 }).height).toBeGreaterThan(1414);
  });
});
