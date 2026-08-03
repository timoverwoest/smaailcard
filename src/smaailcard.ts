import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCard,
  type LovelaceCardEditor,
} from "custom-card-helpers";

import { BG, DIM, H, W, YELLOW, buildBoard, layout, resolveRows } from "./board";
import { CARD_NAME, CARD_TYPE, CARD_VERSION } from "./const";
import type { BoardRow, ResolvedConfig, SmaailcardConfig } from "./types";

console.info(
  `%c ${CARD_NAME.toUpperCase()} %c ${CARD_VERSION} `,
  "color: #0C0C0C; background: #F2DD00; font-weight: 700;",
  "color: #F2DD00; background: #0C0C0C; font-weight: 700;",
);

(window as unknown as { customCards?: unknown[] }).customCards ??= [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: CARD_TYPE,
  name: CARD_NAME,
  description:
    "Dot-matrix departures board — a travel poster of the places you have been.",
  preview: true,
  documentationURL: "https://github.com/timoverwoest/smaailcard",
});

const DEFAULTS = {
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
  pin: [5.12, 52.09] as [number, number],
  footer_title: "Travel board",
  footer_subtitle: "Mapping memories, one destination at a time",
  footer2_title: "My next adventure",
  footer2_subtitle: "Just one ticket away",
  accent_color: YELLOW,
  background_color: BG,
  unlit_color: DIM,
};

@customElement(CARD_TYPE)
export class Smaailcard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedConfig;

  /** Horizontal nudge that keeps the header group optically centred. */
  @state() private _headerShift = 0;

  private _measuredTitle?: string;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement("smaail-card-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): SmaailcardConfig {
    return {
      type: `custom:${CARD_TYPE}`,
      rows: [
        { dest: "NEW YORK", year: "1997" },
        { dest: "MADRID", year: "2000" },
        { dest: "REYKJAVIK", year: "2011" },
        { dest: "CAPE TOWN", year: "2015" },
        { dest: "TOKYO", year: "2019" },
        { dest: "WHAT'S NEXT?", year: "" },
      ],
    };
  }

  public setConfig(config: SmaailcardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    if (config.rows !== undefined && !Array.isArray(config.rows)) {
      throw new Error("`rows` must be a list");
    }

    const rows: BoardRow[] = (config.rows ?? []).map((row) =>
      typeof row === "string" ? parseShorthand(row) : row,
    );

    const rowCount = clamp(
      config.row_count ?? Math.max(DEFAULTS.row_count, rows.length),
      1,
      40,
    );

    this._config = {
      ...DEFAULTS,
      ...config,
      rows,
      row_count: rowCount,
      pin: config.pin === undefined ? DEFAULTS.pin : config.pin,
    };
    this._measuredTitle = undefined;
  }

  public getCardSize(): number {
    return Math.max(3, Math.round((this._height() / H) * 14));
  }

  /** Sensible default footprint in a Sections dashboard. */
  public getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round((this._height() / H) * 16)),
    };
  }

  private _height(): number {
    return this._config ? layout(this._config).height : H;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }
    if (changedProps.has("_config") || changedProps.has("_headerShift")) {
      return true;
    }
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) {
      return true;
    }
    /* Only re-render when an entity the board actually shows has changed. */
    return this._entities().some(
      (id) => oldHass.states[id] !== this.hass?.states[id],
    );
  }

  private _entities(): string[] {
    const ids: string[] = [];
    for (const row of this._config?.rows ?? []) {
      if (row.entity) ids.push(row.entity);
      if (row.year_entity) ids.push(row.year_entity);
    }
    return ids;
  }

  protected render() {
    if (!this._config) {
      return nothing;
    }
    const rows = resolveRows(this._config, this.hass?.states ?? {});
    return html`
      <ha-card>
        ${buildBoard(this._config, rows, { headerShift: this._headerShift })}
      </ha-card>
    `;
  }

  protected updated(): void {
    this._centreHeader();
  }

  /**
   * The poster hard-codes the header position for the word "DEPARTURES", which
   * would sit off-centre for any other title. Measure the rendered group once
   * per title and shift it so the icon + text block is centred on the board.
   */
  private _centreHeader(): void {
    const cfg = this._config;
    if (!cfg?.show_header || this._measuredTitle === cfg.title) {
      return;
    }
    const group = this.renderRoot?.querySelector<SVGGElement>("#sc-header");
    if (!group) {
      return;
    }
    let box: DOMRect;
    try {
      box = group.getBBox();
    } catch {
      return; // not laid out yet (e.g. hidden tab)
    }
    if (!box.width) {
      return;
    }
    this._measuredTitle = cfg.title;
    const shift = Math.round((W / 2 - (box.x + box.width / 2)) * 100) / 100;
    if (shift !== this._headerShift) {
      this._headerShift = shift;
    }
  }

  static styles = css`
    ha-card {
      overflow: hidden;
      /* The board brings its own background; let it run to the card edges. */
      padding: 0;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    text {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
  `;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Accepts the generator's "DESTINATION|YEAR" shorthand for a row. */
function parseShorthand(spec: string): BoardRow {
  const idx = spec.indexOf("|");
  if (idx === -1) {
    return { dest: spec };
  }
  return { dest: spec.slice(0, idx), year: spec.slice(idx + 1) };
}

declare global {
  interface HTMLElementTagNameMap {
    "smaail-card": Smaailcard;
  }
}
