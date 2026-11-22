import { BG, DIM, YELLOW } from "./board";
import { BG as WORLD_BG, LAND, YELLOW as WORLD_YELLOW } from "./worldboard";

/** Marker on the mini world map when `pin` is not set: [longitude, latitude]. */
export const DEFAULT_PIN: [number, number] = [5.12, 52.09];

/** Defaults of the departures board; the card and its editor share them. */
export const BOARD_DEFAULTS = {
  title: "DEPARTURES",
  dest_label: "DESTINATION",
  year_label: "YEAR",
  row_count: 9,
  sort: "asc" as const,
  show_header: true,
  show_column_labels: true,
  show_footer: true,
  show_map: true,
  show_legend: true,
  pin: DEFAULT_PIN,
  footer_title: "Travel board",
  footer_subtitle: "Mapping memories, one destination at a time",
  footer2_title: "My next adventure",
  footer2_subtitle: "Just one ticket away",
  accent_color: YELLOW,
  background_color: BG,
  unlit_color: DIM,
};

/** Defaults of the world map; the card and its editor share them. */
export const WORLD_DEFAULTS = {
  title: "WORLD MAP",
  countries: [] as string[],
  show_header: true,
  show_meters: true,
  show_overview: true,
  show_stats: true,
  caption: "",
  accent_color: WORLD_YELLOW,
  background_color: WORLD_BG,
  land_color: LAND,
};

/**
 * Editor change without defaults: an option that the form shows with its
 * default value is only written to the config when it was already there, so
 * changing one field does not fill the YAML with every default.
 */
export function withoutUnchangedDefaults<T extends Record<string, unknown>>(
  next: T,
  previous: Record<string, unknown>,
  defaults: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...next };
  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in previous) && result[key] === value) {
      delete result[key];
    }
  }
  return result as T;
}
