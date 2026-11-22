import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import { CARD_EDITOR_TYPE, defineElement } from "./const";
import {
  BOARD_DEFAULTS,
  DEFAULT_PIN,
  withoutUnchangedDefaults,
} from "./defaults";
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
    required: true,
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

/* "Alternating" is the absence of a colour; the form needs a value for it. */
const AUTO_COLOR = "auto";

const COLOR_OPTIONS = [
  { value: AUTO_COLOR, label: "Afwisselend (standaard)" },
  { value: "yellow", label: "Geel" },
  { value: "white", label: "Wit" },
  { value: "grey", label: "Grijs" },
];

const ROW_LABELS: Record<string, string> = {
  dest: "Bestemming",
  year: "Jaar",
  entity: "Entity (in plaats van vaste tekst)",
  color: "Kleur",
  full_width: "Volle breedte (geen jaartalkolom)",
};

/** One row as its form shows it. */
interface RowFormData {
  dest: string;
  year: string;
  entity: string;
  color: string;
  full_width: boolean;
}

/* One ha-form per row, so every field is a native Home Assistant input (the
   entity picker only loads the entity list when it is opened). The schema
   depends on three switches and on a colour of its own; each variant is built
   once. */
const rowSchemas = new Map<string, unknown[]>();

/** The colour choices, plus a colour from YAML (hex, "gray") as its own entry. */
function colorOptions(color: string): { value: string; label: string }[] {
  return COLOR_OPTIONS.some((o) => o.value === color)
    ? COLOR_OPTIONS
    : [...COLOR_OPTIONS, { value: color, label: color }];
}

function rowSchema(
  fullWidth: boolean,
  destLocked: boolean,
  yearLocked: boolean,
  color: string
): unknown[] {
  const key = `${fullWidth}|${destLocked}|${yearLocked}|${color}`;
  let schema = rowSchemas.get(key);
  if (!schema) {
    schema = [
      {
        name: "",
        type: "grid",
        schema: [
          { name: "dest", disabled: destLocked, selector: { text: {} } },
          ...(fullWidth
            ? []
            : [{ name: "year", disabled: yearLocked, selector: { text: {} } }]),
        ],
      },
      { name: "entity", selector: { entity: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "color",
            required: true,
            selector: {
              select: {
                mode: "dropdown",
                options: colorOptions(color),
              },
            },
          },
          { name: "full_width", selector: { boolean: {} } },
        ],
      },
    ];
    rowSchemas.set(key, schema);
  }
  return schema;
}

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
        .data=${this._formData()}
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
                    .value=${String(this._config.pin?.[0] ?? DEFAULT_PIN[0])}
                    data-axis="0"
                    @change=${this._pinChanged}
                  />
                </label>
                <label
                  >Breedtegraad
                  <input
                    type="number"
                    step="0.01"
                    .value=${String(this._config.pin?.[1] ?? DEFAULT_PIN[1])}
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
    const data: RowFormData = {
      dest: row.dest ?? "",
      year: fullWidth ? "" : (row.year ?? ""),
      entity: row.entity ?? "",
      color: row.color ?? AUTO_COLOR,
      full_width: fullWidth,
    };
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
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${rowSchema(
            fullWidth,
            !!row.entity,
            !!row.year_entity,
            data.color
          )}
          .computeLabel=${this._computeRowLabel}
          data-index=${index}
          @value-changed=${this._rowChanged}
        ></ha-form>
      </div>
    `;
  }

  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  private _removeRowClicked(ev: Event): void {
    this._removeRow(rowIndex(ev));
  }

  private _rowChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const index = rowIndex(ev);
    const value = ev.detail.value as RowFormData;
    /* Start from the row itself, so keys that only YAML sets (attribute,
       year_entity, year_attribute) survive an edit in the form. */
    const row: BoardRow = { ...this._rows[index] };
    setText(row, "dest", value.dest);
    setText(row, "entity", value.entity);
    if (value.color && value.color !== AUTO_COLOR) {
      row.color = value.color;
    } else {
      delete row.color;
    }
    const year = value.year?.trim();
    if (value.full_width) {
      row.year = "";
    } else if (year) {
      row.year = year;
    } else {
      delete row.year;
    }
    this._updateRows(this._rows.map((r, i) => (i === index ? row : r)));
  }

  private _pinChanged(ev: Event): void {
    const axis = (ev.currentTarget as HTMLElement).dataset.axis === "1" ? 1 : 0;
    this._setPin(axis, ev);
  }

  private _computeLabel = (schema: { name: string }): string =>
    LABELS[schema.name] ?? schema.name;

  private _computeRowLabel = (schema: { name: string }): string =>
    ROW_LABELS[schema.name] ?? schema.name;

  /** Defaults the card uses, shown in the form when the config leaves them out. */
  private _formDefaults(): Record<string, unknown> {
    return {
      ...BOARD_DEFAULTS,
      row_count: Math.max(BOARD_DEFAULTS.row_count, this._rows.length),
    };
  }

  private _formData(): Record<string, unknown> {
    return { ...this._formDefaults(), ...this._config };
  }

  private _formChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    /* ha-form hands back the whole object; keep rows/pin which it doesn't own,
       and leave out defaults that were only shown. */
    this._emit(
      withoutUnchangedDefaults(
        { ...this._config, ...ev.detail.value } as SmaailcardConfig,
        this._config ?? {},
        this._formDefaults()
      )
    );
  }

  private _emit(config: SmaailcardConfig): void {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  private _updateRows(rows: BoardRow[]): void {
    this._emit({ ...this._config, rows } as SmaailcardConfig);
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
      pin: on ? [...DEFAULT_PIN] : null,
    } as SmaailcardConfig);
  }

  private _setPin(index: 0 | 1, ev: Event): void {
    const pin: [number, number] = [
      this._config?.pin?.[0] ?? DEFAULT_PIN[0],
      this._config?.pin?.[1] ?? DEFAULT_PIN[1],
    ];
    pin[index] = Number((ev.target as HTMLInputElement).value);
    this._emit({ ...this._config, pin } as SmaailcardConfig);
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
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--ha-border-radius-md, 8px);
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px)
        var(--ha-space-3, 12px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    .row-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-block-end: var(--ha-space-2, 8px);
    }
    .num {
      font-weight: 500;
      color: var(--secondary-text-color, #727272);
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ha-space-2, 8px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      gap: var(--ha-space-1, 4px);
    }
    label.check {
      flex-direction: row;
      align-items: center;
      gap: var(--ha-space-2, 8px);
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
      border-radius: var(--ha-border-radius-sm, 4px);
      padding: var(--ha-space-2, 8px);
      width: 100%;
      box-sizing: border-box;
    }
    input:disabled {
      opacity: 0.5;
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

/** Set a text key of a row, or drop it when the field is empty. */
function setText(
  row: BoardRow,
  key: "dest" | "entity",
  text: string | undefined
): void {
  const trimmed = text?.trim();
  if (trimmed) {
    row[key] = trimmed;
  } else {
    delete row[key];
  }
}

defineElement(CARD_EDITOR_TYPE, SmaailcardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "smaail-card-editor": SmaailcardEditor;
  }
}
