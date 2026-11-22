import { BG, DIM, YELLOW } from "./board";
import { BG as WORLD_BG, LAND, YELLOW as WORLD_YELLOW } from "./worldboard";

/** Markering op de mini-wereldkaart als `pin` niet is gezet: [lengtegraad, breedtegraad]. */
export const DEFAULT_PIN: [number, number] = [5.12, 52.09];

/** Standaardwaarden van het vertrekbord; kaart en editor delen ze. */
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

/** Standaardwaarden van de wereldkaart; kaart en editor delen ze. */
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
 * Wijziging uit de editor zonder standaardwaarden: een optie die het formulier
 * met zijn standaardwaarde toont, komt alleen in de config als hij er al stond.
 * Zo vult het wijzigen van één veld de YAML niet met alle standaardwaarden.
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
