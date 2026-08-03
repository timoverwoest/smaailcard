import { LovelaceCardConfig } from "custom-card-helpers";

/** How the board orders its rows. */
export type SortOrder = "asc" | "desc" | "none";

/** One line on the board. */
export interface BoardRow {
  /** Static destination text. Ignored when `entity` is set. */
  dest?: string;
  /**
   * Year column.
   *  - omitted / null -> empty year column (the dim grid stays)
   *  - ""             -> the row runs the full width, no year column
   *  - "1997"         -> shown, preceded by the apostrophe marker
   */
  year?: string | null;
  /** "yellow" | "white" | "grey" or a hex colour. Default: rows alternate. */
  color?: string;
  /** Entity whose state (or `attribute`) supplies the destination text. */
  entity?: string;
  attribute?: string;
  /** Entity whose state (or `year_attribute`) supplies the year text. */
  year_entity?: string;
  year_attribute?: string;
}

export interface SmaailcardConfig extends LovelaceCardConfig {
  /** Always "custom:smaail-card". */
  type: string;

  /** Header title. Default "DEPARTURES". */
  title?: string;
  /** Column headings. Defaults "DESTINATION" / "YEAR". */
  dest_label?: string;
  year_label?: string;

  /** The lines on the board. */
  rows?: BoardRow[];
  /** Total line slots, including empty ones. Default 9. */
  row_count?: number;
  /**
   * Order the rows by year: "asc" (oldest first, the default), "desc"
   * (newest first) or "none" to keep the order they are configured in.
   * Rows without a year keep their configured order and follow the rest.
   */
  sort?: SortOrder;

  /** Section toggles — all default to true. */
  show_header?: boolean;
  show_column_labels?: boolean;
  show_footer?: boolean;
  show_map?: boolean;
  show_legend?: boolean;

  /** Home-base marker on the mini map, as [lon, lat]. Null hides it. */
  pin?: [number, number] | null;

  /** Footer blocks. */
  footer_title?: string;
  footer_subtitle?: string;
  footer2_title?: string;
  footer2_subtitle?: string;

  /** Palette overrides. */
  accent_color?: string;
  background_color?: string;
  unlit_color?: string;
}

/* ---------------------------------------------------------- world map card */

export interface SmaailWorldConfig extends LovelaceCardConfig {
  /** Always "custom:smaail-world-card". */
  type: string;

  /** Header title. Default "WORLD MAP". */
  title?: string;

  /**
   * Countries you have visited, as ISO alpha-2 ("NL"), alpha-3 ("NLD"), an
   * English name ("Netherlands") or a known alias ("USA", "UK"). Their landmass
   * lights up in the accent colour.
   */
  countries?: string[];
  /**
   * Entity whose state (or `countries_attribute`) supplies the visited list —
   * a JSON array, or a comma / newline separated string. Merged with `countries`.
   */
  countries_entity?: string;
  countries_attribute?: string;

  /** Section toggles — all default to true. */
  show_header?: boolean;
  /** Per-continent progress meters in the footer. */
  show_meters?: boolean;
  /** Small decorative overview map between the meter groups. */
  show_overview?: boolean;
  /** "N countries · M continents" line under the title. */
  show_stats?: boolean;

  /** Small caption under the overview map. Empty hides it. */
  caption?: string;

  /** Palette overrides. */
  accent_color?: string;
  background_color?: string;
  /** Dim land (unvisited countries). */
  land_color?: string;
}

/** World card config with every optional field resolved. */
export interface ResolvedWorldConfig extends SmaailWorldConfig {
  title: string;
  countries: string[];
  show_header: boolean;
  show_meters: boolean;
  show_overview: boolean;
  show_stats: boolean;
  caption: string;
  accent_color: string;
  background_color: string;
  land_color: string;
}

/** Config with every optional field resolved to a concrete value. */
export interface ResolvedConfig extends SmaailcardConfig {
  title: string;
  dest_label: string;
  year_label: string;
  rows: BoardRow[];
  row_count: number;
  sort: SortOrder;
  show_header: boolean;
  show_column_labels: boolean;
  show_footer: boolean;
  show_map: boolean;
  show_legend: boolean;
  pin: [number, number] | null;
  footer_title: string;
  footer_subtitle: string;
  footer2_title: string;
  footer2_subtitle: string;
  accent_color: string;
  background_color: string;
  unlit_color: string;
}
