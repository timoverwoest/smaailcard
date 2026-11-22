import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
} from "custom-card-helpers";

import { H, W, buildBoard, layout, resolveRows } from "./board";
import {
  CARD_NAME,
  CARD_TYPE,
  CARD_VERSION,
  defineElement,
  registerCustomCard,
} from "./const";
import { BOARD_DEFAULTS } from "./defaults";
import type { BoardRow, ResolvedConfig, SmaailcardConfig } from "./types";

/* De bundel levert beide kaarten uit één bestand (één dashboard-resource
   registreert custom:smaail-card en custom:smaail-world-card). */
import "./worldcard";

registerCustomCard({
  type: CARD_TYPE,
  name: CARD_NAME,
  description:
    "Dot-matrix departures board: a travel poster of the places you have been.",
  preview: true,
  documentationURL: "https://github.com/timoverwoest/smaailcard",
});

const DEFAULTS = BOARD_DEFAULTS;

export class Smaailcard extends LitElement implements LovelaceCard {
  /** Geïnstalleerde versie, te lezen als customElements.get("smaail-card").version. */
  public static readonly version = CARD_VERSION;

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedConfig;

  /** Horizontale verschuiving die de kopgroep optisch gecentreerd houdt. */
  @state() private _headerShift = 0;

  @query("#sc-header") private _header?: SVGGElement;

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
      typeof row === "string" ? parseShorthand(row) : row
    );

    const rowCount = clamp(
      config.row_count ?? Math.max(DEFAULTS.row_count, rows.length),
      1,
      40
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

  /** Redelijke standaardmaat in een dashboard met secties. */
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
    /* Alleen opnieuw tekenen als een entity die het bord toont is veranderd. */
    return this._entities().some(
      (id) => oldHass.states[id] !== this.hass?.states[id]
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
   * De poster zet de kop vast voor het woord "DEPARTURES"; elke andere titel
   * zou dan uit het midden staan. Meet de getekende groep één keer per titel en
   * verschuif hem, zodat icoon en tekst samen in het midden van het bord staan.
   */
  private _centreHeader(): void {
    const cfg = this._config;
    if (!cfg?.show_header || this._measuredTitle === cfg.title) {
      return;
    }
    const group = this._header;
    if (!group) {
      return;
    }
    let box: DOMRect;
    try {
      box = group.getBBox();
    } catch {
      return; // nog niet getekend (bijvoorbeeld een verborgen tabblad)
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
      /* Het bord heeft een eigen achtergrond; laat die tot de randen lopen. */
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

defineElement(CARD_TYPE, Smaailcard);

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Accepteert de korte schrijfwijze "DESTINATION|YEAR" van de generator. */
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
