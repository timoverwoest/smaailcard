import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import type { SmaailWorldConfig } from "./types";
import { COUNTRIES } from "./worldmapdata";

/* Scalar options go through ha-form so they get native Home Assistant inputs. */
const SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_stats", selector: { boolean: {} } },
      { name: "show_meters", selector: { boolean: {} } },
      { name: "show_overview", selector: { boolean: {} } },
    ],
  },
  { name: "caption", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "countries_entity", selector: { entity: {} } },
      { name: "countries_attribute", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "accent_color", selector: { text: {} } },
      { name: "background_color", selector: { text: {} } },
      { name: "land_color", selector: { text: {} } },
    ],
  },
];

const LABELS: Record<string, string> = {
  title: "Titel",
  show_header: "Kop tonen",
  show_stats: "Aantallen tonen",
  show_meters: "Continentmeters tonen",
  show_overview: "Overzichtskaartje tonen",
  caption: "Bijschrift (onder kaartje)",
  countries_entity: "Entity met landenlijst (optioneel)",
  countries_attribute: "Attribuut van die entity (optioneel)",
  accent_color: "Accentkleur",
  background_color: "Achtergrondkleur",
  land_color: "Kleur van land (niet bezocht)",
};

@customElement("smaail-world-card-editor")
export class SmaailWorldCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SmaailWorldConfig;

  public setConfig(config: SmaailWorldConfig): void {
    this._config = config;
  }

  private get _countries(): string[] {
    return this._config?.countries ?? [];
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
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">Bezochte landen</div>
        <p class="help">
          Vul landen in als ISO-code (<em>NL</em>, <em>FR</em>), ISO-3
          (<em>NLD</em>), naam (<em>Netherlands</em>) of een bekende alias
          (<em>USA</em>, <em>UK</em>). Elk bezocht land licht op de kaart op.
        </p>

        ${this._countries.map((c, i) => this._renderCountry(c, i))}

        <div class="add">
          <button @click=${this._addCountry}>+ Land toevoegen</button>
        </div>
      </div>

      <datalist id="swc-countries">
        ${COUNTRIES.map(
          (c) => html`<option value=${c.iso2}>${c.name}</option>`,
        )}
      </datalist>
    `;
  }

  private _renderCountry(country: string, index: number) {
    return html`
      <div class="row">
        <input
          type="text"
          list="swc-countries"
          .value=${country}
          @change=${(e: Event) => this._setCountry(index, value(e))}
        />
        <button
          class="icon"
          title="Verwijderen"
          @click=${() => this._removeCountry(index)}
        >
          ✕
        </button>
      </div>
    `;
  }

  private _computeLabel = (schema: { name: string }): string =>
    LABELS[schema.name] ?? schema.name;

  private _formChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    /* ha-form hands back the whole object; keep `countries`, which it doesn't own. */
    this._emit({ ...this._config, ...ev.detail.value } as SmaailWorldConfig);
  }

  private _emit(config: SmaailWorldConfig): void {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  private _updateCountries(countries: string[]): void {
    this._emit({ ...this._config, countries } as SmaailWorldConfig);
  }

  private _setCountry(index: number, val: string): void {
    const countries = this._countries.map((c, i) => (i === index ? val : c));
    this._updateCountries(countries);
  }

  private _addCountry(): void {
    this._updateCountries([...this._countries, ""]);
  }

  private _removeCountry(index: number): void {
    this._updateCountries(this._countries.filter((_, i) => i !== index));
  }

  static styles = css`
    .section {
      margin-top: 20px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-top: 12px;
    }
    .section-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .help {
      margin: 0 0 12px;
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--secondary-text-color, #727272);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    input[type="text"] {
      font: inherit;
      font-size: 0.95rem;
      color: var(--primary-text-color, #212121);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: 4px;
      padding: 7px 8px;
      flex: 1;
      box-sizing: border-box;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      padding: 7px 12px;
    }
    button.icon {
      border: none;
      background: none;
      font-size: 1rem;
      padding: 2px 6px;
      color: var(--secondary-text-color, #727272);
    }
    button:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add {
      margin-top: 4px;
    }
    datalist {
      display: none;
    }
  `;
}

function value(ev: Event): string {
  return (ev.target as HTMLInputElement).value.trim();
}

declare global {
  interface HTMLElementTagNameMap {
    "smaail-world-card-editor": SmaailWorldCardEditor;
  }
}
