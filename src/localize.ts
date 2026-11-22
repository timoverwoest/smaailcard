import type { HomeAssistant } from "custom-card-helpers";

/* Editor texts in US English (sentence case, as in Home Assistant), with a
   Dutch translation. Placeholders like {n} are filled in by localize(). */
const EN = {
  title: "Title",
  dest_label: "Destination heading",
  year_label: "Year heading",
  row_count: "Number of rows (including empty ones)",
  sort: "Order",
  sort_asc: "By year, oldest first",
  sort_desc: "By year, newest first",
  sort_none: "Don't sort (order below)",
  show_header: "Show header",
  show_column_labels: "Show column headings",
  show_footer: "Show footer",
  show_map: "Show world map",
  show_legend: "Show character set",
  footer_title: "Footer 1",
  footer_subtitle: "Subtitle 1",
  footer2_title: "Footer 2",
  footer2_subtitle: "Subtitle 2",
  accent_color: "Accent color",
  background_color: "Background color",
  unlit_color: "Color of unlit dots",

  rows: "Rows",
  rows_help:
    "Leave the year empty for an empty year column. Turn on full width to run the row across the whole board. Pick an entity to take the text from Home Assistant instead of fixed text.",
  add_row: "+ Add row",
  remove_row: "Remove row",
  remove_row_n: "Remove row {n}",
  dest: "Destination",
  year: "Year",
  entity: "Entity (instead of fixed text)",
  color: "Color",
  full_width: "Full width (no year column)",
  color_auto: "Alternating (default)",
  color_yellow: "Yellow",
  color_white: "White",
  color_grey: "Gray",

  pin_section: "Marker on the world map",
  pin_toggle: "Mark home base",
  longitude: "Longitude",
  latitude: "Latitude",

  show_stats: "Show counts",
  show_meters: "Show continent meters",
  show_overview: "Show overview map",
  caption: "Caption (below the overview map)",
  countries_entity: "Entity with a list of countries (optional)",
  countries_attribute: "Attribute of that entity (optional)",
  land_color: "Color of land not visited",
  countries: "Visited countries",
  countries_help:
    "Enter countries as an ISO code (NL, FR), ISO-3 (NLD), English name (Netherlands) or a known alias (USA, UK). Every visited country lights up on the map.",
  add_country: "+ Add country",
  country_n: "Country {n}",
  remove_country: "Remove",
  remove_country_n: "Remove country {n}",
};

export type LocalizeKey = keyof typeof EN;

const NL: Record<LocalizeKey, string> = {
  title: "Titel",
  dest_label: "Kop bestemmingskolom",
  year_label: "Kop jaartalkolom",
  row_count: "Aantal regels (incl. lege)",
  sort: "Volgorde",
  sort_asc: "Op jaartal, oudste eerst",
  sort_desc: "Op jaartal, nieuwste eerst",
  sort_none: "Niet sorteren (volgorde hieronder)",
  show_header: "Kop tonen",
  show_column_labels: "Kolomkoppen tonen",
  show_footer: "Voettekst tonen",
  show_map: "Wereldkaart tonen",
  show_legend: "Tekenset tonen",
  footer_title: "Voettekst 1",
  footer_subtitle: "Ondertitel 1",
  footer2_title: "Voettekst 2",
  footer2_subtitle: "Ondertitel 2",
  accent_color: "Accentkleur",
  background_color: "Achtergrondkleur",
  unlit_color: "Kleur gedoofde dots",

  rows: "Regels",
  rows_help:
    "Laat het jaar leeg voor een lege jaartalkolom. Zet volle breedte aan om de regel over het hele bord te laten lopen. Kies een entity om de tekst uit Home Assistant te halen in plaats van vaste tekst.",
  add_row: "+ Regel toevoegen",
  remove_row: "Regel verwijderen",
  remove_row_n: "Regel {n} verwijderen",
  dest: "Bestemming",
  year: "Jaar",
  entity: "Entity (in plaats van vaste tekst)",
  color: "Kleur",
  full_width: "Volle breedte (geen jaartalkolom)",
  color_auto: "Afwisselend (standaard)",
  color_yellow: "Geel",
  color_white: "Wit",
  color_grey: "Grijs",

  pin_section: "Markering op de wereldkaart",
  pin_toggle: "Thuisbasis markeren",
  longitude: "Lengtegraad",
  latitude: "Breedtegraad",

  show_stats: "Aantallen tonen",
  show_meters: "Continentmeters tonen",
  show_overview: "Overzichtskaartje tonen",
  caption: "Bijschrift (onder kaartje)",
  countries_entity: "Entity met landenlijst (optioneel)",
  countries_attribute: "Attribuut van die entity (optioneel)",
  land_color: "Kleur van land (niet bezocht)",
  countries: "Bezochte landen",
  countries_help:
    "Vul landen in als ISO-code (NL, FR), ISO-3 (NLD), Engelse naam (Netherlands) of een bekende alias (USA, UK). Elk bezocht land licht op de kaart op.",
  add_country: "+ Land toevoegen",
  country_n: "Land {n}",
  remove_country: "Verwijderen",
  remove_country_n: "Land {n} verwijderen",
};

export type Language = "en" | "nl";

/** Dutch when Home Assistant is set to Dutch, English otherwise. */
export function editorLanguage(hass?: HomeAssistant): Language {
  return (hass?.language ?? "").toLowerCase().startsWith("nl") ? "nl" : "en";
}

/** Editor text in the language of Home Assistant, with {n} and the like filled in. */
export function localize(
  language: Language,
  key: LocalizeKey,
  values: Record<string, string | number> = {}
): string {
  // An unknown key (a schema field without a text) shows the key itself.
  const text = (language === "nl" ? NL : EN)[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}
