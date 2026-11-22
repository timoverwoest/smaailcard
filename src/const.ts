export const CARD_VERSION = "1.1.1";

export const CARD_TYPE = "smaail-card";
export const CARD_EDITOR_TYPE = "smaail-card-editor";
export const CARD_NAME = "Smaailcard";

export const WORLD_CARD_TYPE = "smaail-world-card";
export const WORLD_CARD_EDITOR_TYPE = "smaail-world-card-editor";
export const WORLD_CARD_NAME = "Smaail World Map";

/**
 * Define a custom element only once. The same bundle can end up loaded twice
 * (for example via an old /hacsfiles/ resource next to the /local/community/
 * one the Marketplace uses); a second define would throw and break the card.
 */
export function defineElement(
  tag: string,
  element: CustomElementConstructor
): void {
  if (!customElements.get(tag)) {
    customElements.define(tag, element);
  }
}

/** Entry for the card picker in Home Assistant ("Add card"). */
export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL: string;
}

/** Add a card to the card picker, once, even if the bundle loads twice. */
export function registerCustomCard(entry: CustomCardEntry): void {
  const w = window as unknown as { customCards?: CustomCardEntry[] };
  w.customCards ??= [];
  if (!w.customCards.some((card) => card.type === entry.type)) {
    w.customCards.push(entry);
  }
}
