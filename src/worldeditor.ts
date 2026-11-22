import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import { WORLD_CARD_EDITOR_TYPE, defineElement } from "./const";
import { WORLD_DEFAULTS, withoutUnchangedDefaults } from "./defaults";
import {
  type Language,
  type LocalizeKey,
  editorLanguage,
  localize,
} from "./localize";
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

/* HA's own field for each country: a searchable list of the countries the
   map knows, where an ISO-3 code, a name or an alias can be typed as well.
   The list never changes, so it is built once. */
const COUNTRY_SELECTOR = {
  select: {
    mode: "dropdown",
    custom_value: true,
    options: COUNTRIES.map((c) => ({ value: c.iso2, label: c.name })),
  },
};

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

    const lang = editorLanguage(this.hass);
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...WORLD_DEFAULTS, ...this._config }}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">${localize(lang, "countries")}</div>
        <p class="help">${localize(lang, "countries_help")}</p>

        ${this._countries.map((c, i) => this._renderCountry(lang, c, i))}

        <div class="add">
          <button type="button" @click=${this._addCountry}>
            ${localize(lang, "add_country")}
          </button>
        </div>
      </div>
    `;
  }

  private _renderCountry(lang: Language, country: string, index: number) {
    return html`
      <div class="row">
        <ha-selector
          .hass=${this.hass}
          .selector=${COUNTRY_SELECTOR}
          .value=${country}
          .label=${localize(lang, "country_n", { n: index + 1 })}
          .required=${false}
          data-index=${index}
          @value-changed=${this._countryChanged}
        ></ha-selector>
        <button
          type="button"
          class="icon"
          title=${localize(lang, "remove_country")}
          aria-label=${localize(lang, "remove_country_n", { n: index + 1 })}
          data-index=${index}
          @click=${this._removeCountryClicked}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    `;
  }

  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  private _countryChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._setCountry(rowIndex(ev), String(ev.detail.value ?? "").trim());
  }

  private _removeCountryClicked(ev: Event): void {
    this._removeCountry(rowIndex(ev));
  }

  private _computeLabel = (schema: { name: string }): string =>
    localize(editorLanguage(this.hass), schema.name as LocalizeKey);

  private _formChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    /* ha-form hands back the whole object; keep `countries`, which it doesn't
       own, and leave out defaults that were only shown. */
    this._emit(
      withoutUnchangedDefaults(
        { ...this._config, ...ev.detail.value } as SmaailWorldConfig,
        this._config ?? {},
        WORLD_DEFAULTS
      )
    );
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
      margin-block-start: var(--ha-space-5, 20px);
      border-block-start: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-block-start: var(--ha-space-3, 12px);
    }
    .section-title {
      font-weight: 500;
      margin-block-end: var(--ha-space-1, 4px);
    }
    .help {
      margin: 0 0 var(--ha-space-3, 12px);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--secondary-text-color, #727272);
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    ha-selector {
      flex: 1;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: var(--ha-border-radius-sm, 4px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    }
    button.icon {
      border: none;
      background: none;
      font-size: 1rem;
      min-width: 36px;
      min-height: 36px;
      padding: 0;
      color: var(--secondary-text-color, #727272);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    button:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add {
      margin-block-start: var(--ha-space-1, 4px);
    }
  `;
}

function rowIndex(ev: Event): number {
  return Number((ev.currentTarget as HTMLElement).dataset.index);
}

defineElement(WORLD_CARD_EDITOR_TYPE, SmaailWorldCardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "smaail-world-card-editor": SmaailWorldCardEditor;
  }
}
