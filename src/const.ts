export const CARD_VERSION = "1.1.2";

export const CARD_TYPE = "smaail-card";
export const CARD_EDITOR_TYPE = "smaail-card-editor";
export const CARD_NAME = "Smaailcard";

export const WORLD_CARD_TYPE = "smaail-world-card";
export const WORLD_CARD_EDITOR_TYPE = "smaail-world-card-editor";
export const WORLD_CARD_NAME = "Smaail World Map";

/**
 * Registreer een custom element maar één keer. Dezelfde bundel kan twee keer
 * laden (bijvoorbeeld via een oude /hacsfiles/-resource naast de
 * /local/community/-resource van de Marketplace); een tweede define gooit een
 * fout en breekt de kaart.
 */
export function defineElement(
  tag: string,
  element: CustomElementConstructor
): void {
  if (!customElements.get(tag)) {
    customElements.define(tag, element);
  }
}

/** Ingang voor de kaartkiezer in Home Assistant ("Kaart toevoegen"). */
export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL: string;
}

/** Zet een kaart één keer in de kaartkiezer, ook als de bundel twee keer laadt. */
export function registerCustomCard(entry: CustomCardEntry): void {
  const w = window as unknown as { customCards?: CustomCardEntry[] };
  w.customCards ??= [];
  if (!w.customCards.some((card) => card.type === entry.type)) {
    w.customCards.push(entry);
  }
}
