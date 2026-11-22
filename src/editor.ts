import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import { CARD_EDITOR_TYPE, defineElement } from "./const";
import type { BoardRow, SmaailcardConfig } from "./types";

/* Scalar options go through ha-form so they get native Home Assistant inputs. */
const SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "dest_label", selector: { text: {} } },
      { name: "year_label", selector: { text: {} } },
    ],
  },
  {
    name: "row_count",
    selector: { number: { min: 1, max: 40, mode: "box", step: 1 } },
  },
  {
    name: "sort",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "asc", label: "Op jaartal, oudste eerst" },
          { value: "desc", label: "Op jaartal, nieuwste eerst" },
          { value: "none", label: "Niet sorteren (volgorde hieronder)" },
        ],
      },
    },
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_column_labels", selector: { boolean: {} } },
      { name: "show_footer", selector: { boolean: {} } },
      { name: "show_map", selector: { boolean: {} } },
      { name: "show_legend", selector: { boolean: {} } },
    ],
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "footer_title", selector: { text: {} } },
      { name: "footer_subtitle", selector: { text: {} } },
      { name: "footer2_title", selector: { text: {} } },
      { name: "footer2_subtitle", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "accent_color", selector: { text: {} } },
      { name: "background_color", selector: { text: {} } },
      { name: "unlit_color", selector: { text: {} } },
    ],
  },
];

const LABELS: Record<string, string> = {
  title: "Titel",
  dest_label: "Kop bestemmingskolom",
  year_label: "Kop jaartalkolom",
  row_count: "Aantal regels (incl. lege)",
  sort: "Volgorde",
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
};

/* HA's own entity picker: it only loads the entity list when it is opened,
   instead of a <datalist> with every entity that was rebuilt on each update. */
const ENTITY_SELECTOR = { entity: {} };

const COLOR_OPTIONS = [
  { value: "", label: "Afwisselend (standaard)" },
  { value: "yellow", label: "Geel" },
  { value: "white", label: "Wit" },
  { value: "grey", label: "Grijs" },
];

export class SmaailcardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SmaailcardConfig;

  public setConfig(config: SmaailcardConfig): void {
    this._config = config;
  }

  private get _rows(): BoardRow[] {
    return this._config?.rows ?? [];
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
        <div class="section-title">Regels</div>
        <p class="help">
          Laat <em>jaar</em> leeg voor een lege jaartalkolom. Vink
          <em>volle breedte</em> aan om de regel over het hele bord te laten
          lopen. Vul een <em>entity</em> in om de tekst uit Home Assistant te
          halen in plaats van vaste tekst.
        </p>

        ${this._rows.map((row, i) => this._renderRow(row, i))}

        <div class="add">
          <button type="button" @click=${this._addRow}>
            + Regel toevoegen
          </button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Markering op de wereldkaart</div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${this._config.pin !== null}
            @change=${this._togglePin}
          />
          Thuisbasis markeren
        </label>
        ${
          this._config.pin !== null
            ? html`<div class="grid2">
                <label
                  >Lengtegraad
                  <input
                    type="number"
                    step="0.01"
                    .value=${String(this._config.pin?.[0] ?? 5.12)}
                    data-axis="0"
                    @change=${this._pinChanged}
                  />
                </label>
                <label
                  >Breedtegraad
                  <input
                    type="number"
                    step="0.01"
                    .value=${String(this._config.pin?.[1] ?? 52.09)}
                    data-axis="1"
                    @change=${this._pinChanged}
                  />
                </label>
              </div>`
            : nothing
        }
      </div>
    `;
  }

  private _renderRow(row: BoardRow, index: number) {
    const fullWidth = row.year === "";
    return html`
      <div class="row">
        <div class="row-head">
          <span class="num">${index + 1}</span>
          <button
            type="button"
            class="icon"
            title="Regel verwijderen"
            aria-label=${`Regel ${index + 1} verwijderen`}
            data-index=${index}
            @click=${this._removeRowClicked}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div class="grid2">
          <label
            >Bestemming
            <input
              type="text"
              .value=${row.dest ?? ""}
              ?disabled=${!!row.entity}
              data-index=${index}
              @change=${this._destChanged}
            />
          </label>
          <label
            >Jaar
            <input
              type="text"
              .value=${fullWidth ? "" : (row.year ?? "")}
              ?disabled=${fullWidth || !!row.year_entity}
              data-index=${index}
              @change=${this._yearChanged}
            />
          </label>
        </div>

        <div class="grid2">
          <ha-selector
            .hass=${this.hass}
            .selector=${ENTITY_SELECTOR}
            .value=${row.entity ?? ""}
            .label=${"Entity (bestemming, optioneel)"}
            .required=${false}
            data-index=${index}
            @value-changed=${this._entityChanged}
          ></ha-selector>
          <label
            >Kleur
            <select
              .value=${row.color ?? ""}
              data-index=${index}
              @change=${this._colorChanged}
            >
              ${COLOR_OPTIONS.map(
                (o) =>
                  html`<option
                    value=${o.value}
                    ?selected=${(row.color ?? "") === o.value}
                  >
                    ${o.label}
                  </option>`
              )}
            </select>
          </label>
        </div>

        <label class="check">
          <input
            type="checkbox"
            .checked=${fullWidth}
            data-index=${index}
            @change=${this._fullWidthChanged}
          />
          Volle breedte (geen jaartalkolom)
        </label>
      </div>
    `;
  }

  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  private _removeRowClicked(ev: Event): void {
    this._removeRow(rowIndex(ev));
  }

  private _destChanged(ev: Event): void {
    this._setRow(rowIndex(ev), "dest", value(ev));
  }

  private _yearChanged(ev: Event): void {
    this._setYear(rowIndex(ev), value(ev));
  }

  private _entityChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._setRow(rowIndex(ev), "entity", ev.detail.value || undefined);
  }

  private _colorChanged(ev: Event): void {
    this._setRow(rowIndex(ev), "color", value(ev) || undefined);
  }

  private _fullWidthChanged(ev: Event): void {
    this._setFullWidth(rowIndex(ev), checked(ev));
  }

  private _pinChanged(ev: Event): void {
    const axis = (ev.currentTarget as HTMLElement).dataset.axis === "1" ? 1 : 0;
    this._setPin(axis, ev);
  }

  private _computeLabel = (schema: { name: string }): string =>
    LABELS[schema.name] ?? schema.name;

  private _formChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    /* ha-form hands back the whole object; keep rows/pin which it doesn't own. */
    this._emit({ ...this._config, ...ev.detail.value } as SmaailcardConfig);
  }

  private _emit(config: SmaailcardConfig): void {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  private _updateRows(rows: BoardRow[]): void {
    this._emit({ ...this._config, rows } as SmaailcardConfig);
  }

  private _setRow(index: number, key: keyof BoardRow, val: unknown): void {
    const rows = this._rows.map((r, i) =>
      i === index ? { ...r, [key]: val } : r
    );
    if (val === undefined || val === "") {
      delete (rows[index] as Record<string, unknown>)[key];
    }
    this._updateRows(rows);
  }

  private _setYear(index: number, val: string): void {
    const rows = this._rows.map((r) => ({ ...r }) as BoardRow);
    if (val === "") {
      delete rows[index].year;
    } else {
      rows[index].year = val;
    }
    this._updateRows(rows);
  }

  private _setFullWidth(index: number, on: boolean): void {
    const rows = this._rows.map((r) => ({ ...r }) as BoardRow);
    if (on) {
      rows[index].year = "";
    } else {
      delete rows[index].year;
    }
    this._updateRows(rows);
  }

  private _addRow(): void {
    this._updateRows([...this._rows, { dest: "" }]);
  }

  private _removeRow(index: number): void {
    this._updateRows(this._rows.filter((_, i) => i !== index));
  }

  private _togglePin(ev: Event): void {
    const on = (ev.target as HTMLInputElement).checked;
    this._emit({
      ...this._config,
      pin: on ? [5.12, 52.09] : null,
    } as SmaailcardConfig);
  }

  private _setPin(index: 0 | 1, ev: Event): void {
    const pin: [number, number] = [
      this._config?.pin?.[0] ?? 5.12,
      this._config?.pin?.[1] ?? 52.09,
    ];
    pin[index] = Number((ev.target as HTMLInputElement).value);
    this._emit({ ...this._config, pin } as SmaailcardConfig);
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
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 10px 12px 12px;
      margin-bottom: 10px;
    }
    .row-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .num {
      font-weight: 500;
      color: var(--secondary-text-color, #727272);
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 8px;
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      gap: 4px;
    }
    label.check {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }
    input[type="text"],
    input[type="number"],
    select {
      font: inherit;
      font-size: 0.95rem;
      color: var(--primary-text-color, #212121);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: 4px;
      padding: 7px 8px;
      width: 100%;
      box-sizing: border-box;
    }
    input:disabled {
      opacity: 0.5;
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
      margin-top: 4px;
    }
  `;
}

function value(ev: Event): string {
  return (ev.target as HTMLInputElement | HTMLSelectElement).value.trim();
}

function rowIndex(ev: Event): number {
  return Number((ev.currentTarget as HTMLElement).dataset.index);
}

function checked(ev: Event): boolean {
  return (ev.target as HTMLInputElement).checked;
}

defineElement(CARD_EDITOR_TYPE, SmaailcardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "smaail-card-editor": SmaailcardEditor;
  }
}
