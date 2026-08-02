import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import type { SmaailcardConfig } from "./types";

/* ha-form schema — HA renders native inputs/selectors from this. */
const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "header", selector: { text: {} } },
  { name: "entity", selector: { entity: {} } },
];

@customElement("smaail-card-editor")
export class SmaailcardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SmaailcardConfig;

  public setConfig(config: SmaailcardConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: { name: string }): string => {
    switch (schema.name) {
      case "name":
        return "Naam";
      case "header":
        return "Kop (optioneel)";
      case "entity":
        return "Entity (optioneel)";
      default:
        return schema.name;
    }
  };

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "smaail-card-editor": SmaailcardEditor;
  }
}
