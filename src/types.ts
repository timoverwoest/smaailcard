import type { LovelaceCardConfig } from "custom-card-helpers";

/** Hoe het bord de regels ordent. */
export type SortOrder = "asc" | "desc" | "none";

/** Eén regel op het bord. */
export interface BoardRow {
  /** Vaste tekst voor de bestemming. Genegeerd als `entity` is gezet. */
  dest?: string;
  /**
   * Jaartalkolom.
   *  - weggelaten / null -> lege jaartalkolom (het gedoofde raster blijft)
   *  - ""                -> de regel loopt over de volle breedte, geen jaartalkolom
   *  - "1997"            -> getoond, met de apostrof ervoor
   */
  year?: string | null;
  /** "yellow" | "white" | "grey" of een hexkleur. Standaard: regels wisselen af. */
  color?: string;
  /** Entity waarvan de status (of `attribute`) de bestemming levert. */
  entity?: string;
  attribute?: string;
  /** Entity waarvan de status (of `year_attribute`) het jaartal levert. */
  year_entity?: string;
  year_attribute?: string;
}

export interface SmaailcardConfig extends LovelaceCardConfig {
  /** Altijd "custom:smaail-card". */
  type: string;

  /** Titel in de kop. Standaard "DEPARTURES". */
  title?: string;
  /** Kolomkoppen. Standaard "DESTINATION" / "YEAR". */
  dest_label?: string;
  year_label?: string;

  /** De regels op het bord. */
  rows?: BoardRow[];
  /** Aantal regelposities, inclusief lege. Standaard 9. */
  row_count?: number;
  /**
   * Regels op jaartal ordenen: "asc" (oudste eerst, de standaard), "desc"
   * (nieuwste eerst) of "none" voor de volgorde uit de configuratie.
   * Regels zonder jaartal houden hun volgorde en komen na de rest.
   */
  sort?: SortOrder;

  /** Onderdelen aan of uit; standaard allemaal aan. */
  show_header?: boolean;
  show_column_labels?: boolean;
  show_footer?: boolean;
  show_map?: boolean;
  show_legend?: boolean;

  /** Markering van de thuisbasis op de minikaart, als [lon, lat]. Null verbergt hem. */
  pin?: [number, number] | null;

  /** Voetteksten. */
  footer_title?: string;
  footer_subtitle?: string;
  footer2_title?: string;
  footer2_subtitle?: string;

  /** Eigen kleuren in plaats van het palet. */
  accent_color?: string;
  background_color?: string;
  unlit_color?: string;
}

/* ------------------------------------------------------ wereldkaart-kaart */

export interface SmaailWorldConfig extends LovelaceCardConfig {
  /** Altijd "custom:smaail-world-card". */
  type: string;

  /** Titel in de kop. Standaard "WORLD MAP". */
  title?: string;

  /**
   * Bezochte landen, als ISO alpha-2 ("NL"), alpha-3 ("NLD"), Engelse naam
   * ("Netherlands") of een bekende alias ("USA", "UK"). Hun landmassa licht
   * op in de accentkleur.
   */
  countries?: string[];
  /**
   * Entity waarvan de status (of `countries_attribute`) de bezochte landen
   * levert: een JSON-array of tekst gescheiden door komma's of nieuwe regels.
   * Wordt samengevoegd met `countries`.
   */
  countries_entity?: string;
  countries_attribute?: string;

  /** Onderdelen aan of uit; standaard allemaal aan. */
  show_header?: boolean;
  /** Voortgangsmeters per werelddeel onderaan. */
  show_meters?: boolean;
  /** Klein overzichtskaartje tussen de meters. */
  show_overview?: boolean;
  /** Regel "N countries · M continents" onder de titel. */
  show_stats?: boolean;

  /** Bijschrift onder het overzichtskaartje. Leeg verbergt het. */
  caption?: string;

  /** Eigen kleuren in plaats van het palet. */
  accent_color?: string;
  background_color?: string;
  /** Gedimd land (niet bezochte landen). */
  land_color?: string;
}

/** Config van de wereldkaart met elk optioneel veld ingevuld. */
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

/** Config met elk optioneel veld ingevuld met een concrete waarde. */
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
