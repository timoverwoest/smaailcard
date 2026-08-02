import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCard,
  type LovelaceCardEditor,
} from "custom-card-helpers";

import { CARD_NAME, CARD_TYPE, CARD_VERSION } from "./const";
import type { SmaailcardConfig } from "./types";

/* Version banner in the browser console — handy to confirm which build HA loaded. */
console.info(
  `%c ${CARD_NAME.toUpperCase()} %c ${CARD_VERSION} `,
  "color: #fff; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: #fff; font-weight: 700;",
);

/* Register in the Lovelace card picker ("Add card" dialog). */
(window as unknown as { customCards?: unknown[] }).customCards ??= [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: CARD_TYPE,
  name: CARD_NAME,
  description: "A starter custom card built with Lit + TypeScript.",
  preview: true,
  documentationURL: "https://github.com/timoverwoest/smaailcard",
});

@customElement(CARD_TYPE)
export class Smaailcard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SmaailcardConfig;

  /** Lazily provide the visual config editor for the UI. */
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement(
      "smaail-card-editor",
    ) as LovelaceCardEditor;
  }

  /** Default config used when the card is first added from the picker. */
  public static getStubConfig(): SmaailcardConfig {
    return { type: `custom:${CARD_TYPE}`, name: CARD_NAME };
  }

  public setConfig(config: SmaailcardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = { name: CARD_NAME, ...config };
  }

  public getCardSize(): number {
    return 3;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }
    // Always re-render on a config change or the first hass.
    if (changedProps.has("_config")) {
      return true;
    }
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) {
      return true;
    }
    // Otherwise only re-render when the bound entity actually changed, so we
    // don't re-render on every unrelated state update in Home Assistant.
    const entity = this._config.entity;
    if (!entity) {
      return false;
    }
    return oldHass.states[entity] !== this.hass?.states[entity];
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    return html`
      <ha-card>
        ${this._config.header
          ? html`<h1 class="card-header">${this._config.header}</h1>`
          : nothing}
        <div class="card-content">
          <div class="name">${this._config.name}</div>
          ${this._renderBody()}
        </div>
      </ha-card>
    `;
  }

  private _renderBody() {
    const entityId = this._config?.entity;

    if (!entityId) {
      return html`<div class="hint">
        Stel een <code>entity</code> in om hier de status te tonen — of vervang
        deze <code>_renderBody()</code> door je eigen inhoud.
      </div>`;
    }

    const stateObj = this.hass!.states[entityId];
    if (!stateObj) {
      return html`<div class="warning">Entity niet gevonden: ${entityId}</div>`;
    }

    const unit = stateObj.attributes.unit_of_measurement;
    return html`
      <div class="entity">
        <span class="entity-name"
          >${stateObj.attributes.friendly_name ?? entityId}</span
        >
        <span class="state">${stateObj.state}${unit ? ` ${unit}` : ""}</span>
      </div>
    `;
  }

  static styles = css`
    .card-header {
      margin: 0;
      padding: 16px 16px 0;
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.2;
      letter-spacing: -0.012em;
    }
    .card-content {
      padding: 16px;
    }
    .name {
      font-weight: 500;
      margin-bottom: 8px;
    }
    .entity {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }
    .entity-name {
      color: var(--secondary-text-color, #727272);
    }
    .state {
      font-size: 1.6rem;
      font-weight: 300;
    }
    .hint {
      color: var(--secondary-text-color, #727272);
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .warning {
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
    }
    code {
      background: var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 0.85em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "smaail-card": Smaailcard;
  }
}
