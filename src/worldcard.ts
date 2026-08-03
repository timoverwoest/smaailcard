import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCard,
  type LovelaceCardEditor,
} from "custom-card-helpers";

import { CARD_VERSION, WORLD_CARD_NAME, WORLD_CARD_TYPE } from "./const";
import { BG, LAND, W, YELLOW, buildWorldBoard, worldLayout } from "./worldboard";
import { parseCountryList, resolveVisited } from "./countries";
import type { ResolvedWorldConfig, SmaailWorldConfig } from "./types";

(window as unknown as { customCards?: unknown[] }).customCards ??= [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: WORLD_CARD_TYPE,
  name: WORLD_CARD_NAME,
  description:
    "Dot-matrix world map — the countries you have visited, lit up by continent.",
  preview: true,
  documentationURL: "https://github.com/timoverwoest/smaailcard",
});

const DEFAULTS = {
  title: "WORLD MAP",
  countries: [] as string[],
  show_header: true,
  show_meters: true,
  show_overview: true,
  show_stats: true,
  caption: "",
  accent_color: YELLOW,
  background_color: BG,
  land_color: LAND,
};

@customElement(WORLD_CARD_TYPE)
export class SmaailWorldCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedWorldConfig;

  /** Horizontal nudge that keeps the header group optically centred. */
  @state() private _headerShift = 0;

  private _measuredTitle?: string;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./worldeditor");
    return document.createElement(
      "smaail-world-card-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): SmaailWorldConfig {
    return {
      type: `custom:${WORLD_CARD_TYPE}`,
      countries: ["NL", "BE", "FR", "ES", "US", "MA", "JP", "AU", "BR", "ZA"],
    };
  }

  public setConfig(config: SmaailWorldConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    if (config.countries !== undefined && !Array.isArray(config.countries)) {
      throw new Error("`countries` must be a list");
    }
    this._config = {
      ...DEFAULTS,
      ...config,
      countries: (config.countries ?? []).map((c) => String(c)),
    };
    this._measuredTitle = undefined;
  }

  public getCardSize(): number {
    return Math.max(3, Math.round((this._height() / W) * 14));
  }

  public getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round((this._height() / W) * 20)),
    };
  }

  private _height(): number {
    return this._config ? worldLayout(this._config).height : 700;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }
    if (changedProps.has("_config") || changedProps.has("_headerShift")) {
      return true;
    }
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass || !this._config.countries_entity) {
      return !oldHass;
    }
    const id = this._config.countries_entity;
    return oldHass.states[id] !== this.hass?.states[id];
  }

  /** Merge the configured country list with any entity-provided list. */
  private _visitedInputs(): string[] {
    const cfg = this._config;
    if (!cfg) {
      return [];
    }
    const inputs = [...cfg.countries];
    if (cfg.countries_entity && this.hass) {
      const st = this.hass.states[cfg.countries_entity];
      if (st) {
        const raw = cfg.countries_attribute
          ? st.attributes[cfg.countries_attribute]
          : st.state;
        inputs.push(...parseCountryList(raw));
      }
    }
    return inputs;
  }

  protected render() {
    if (!this._config) {
      return nothing;
    }
    const visited = resolveVisited(this._visitedInputs());
    return html`
      <ha-card>
        ${buildWorldBoard(this._config, visited, visited.indices.size, {
          headerShift: this._headerShift,
        })}
      </ha-card>
    `;
  }

  protected updated(): void {
    this._centreHeader();
  }

  /** Measure the rendered header group once per title and centre it on the board. */
  private _centreHeader(): void {
    const cfg = this._config;
    if (!cfg?.show_header || this._measuredTitle === cfg.title) {
      return;
    }
    const group = this.renderRoot?.querySelector<SVGGElement>("#swc-header");
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

console.info(
  `%c ${WORLD_CARD_NAME.toUpperCase()} %c ${CARD_VERSION} `,
  "color: #0C0C0C; background: #F2DD00; font-weight: 700;",
  "color: #F2DD00; background: #0C0C0C; font-weight: 700;",
);

declare global {
  interface HTMLElementTagNameMap {
    "smaail-world-card": SmaailWorldCard;
  }
}
