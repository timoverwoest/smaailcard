/*
 * Dev-only harness entry, loaded by index.html via `npm run dev`.
 * Fakes just enough of Home Assistant (a minimal <ha-card> and a `hass` object
 * with a couple of entities) to render the board in a plain browser. Never
 * shipped: `vite build` bundles src/smaailcard.ts, not this file.
 */
import "./smaailcard";

if (!customElements.get("ha-card")) {
  customElements.define(
    "ha-card",
    class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const s = this.attachShadow({ mode: "open" });
        s.innerHTML =
          "<style>:host{display:block;border-radius:12px;" +
          "box-shadow:0 2px 8px rgba(0,0,0,.15);background:#0C0C0C;" +
          "overflow:hidden}</style><slot></slot>";
      }
    },
  );
}

const card = document.getElementById("card") as HTMLElement & {
  setConfig: (c: unknown) => void;
  hass: unknown;
};

card.setConfig({
  type: "custom:smaail-card",
  /* Deliberately out of order: the card sorts by year, so this should render
     as 1997, 2000, 2011, 2015, 2019 with the statement line last. */
  rows: [
    { dest: "TOKYO", year: "2019" },
    { dest: "WHAT'S NEXT?", year: "" },
    { dest: "MADRID", year: "2000" },
    { dest: "CAPE TOWN", year: "2015" },
    { dest: "NEW YORK", year: "1997" },
    { dest: "REYKJAVIK", year: "2011" },
  ],
});

card.hass = {
  states: {
    "sensor.next_trip": {
      entity_id: "sensor.next_trip",
      state: "LISBON",
      attributes: { friendly_name: "Volgende reis" },
    },
  },
  localize: (key: string) => key,
};
