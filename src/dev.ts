/*
 * Alleen voor ontwikkelen: geladen door index.html via `npm run dev`.
 * Bootst net genoeg van Home Assistant na (een minimale <ha-card> en een
 * `hass`-object met een paar entities) om het bord in een gewone browser te
 * tekenen. Gaat nooit mee: `vite build` bundelt src/smaailcard.ts, niet dit
 * bestand.
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
    }
  );
}

const card = document.getElementById("card") as HTMLElement & {
  setConfig: (c: unknown) => void;
  hass: unknown;
};

card.setConfig({
  type: "custom:smaail-card",
  /* Bewust door elkaar: de kaart sorteert op jaartal, dus dit moet verschijnen
     als 1997, 2000, 2011, 2015, 2019 met de afsluitende regel als laatste. */
  rows: [
    { dest: "TOKYO", year: "2019" },
    { dest: "WHAT'S NEXT?", year: "" },
    { dest: "MADRID", year: "2000" },
    { dest: "CAPE TOWN", year: "2015" },
    { dest: "NEW YORK", year: "1997" },
    { dest: "REYKJAVIK", year: "2011" },
  ],
});

const hass = {
  states: {
    "sensor.next_trip": {
      entity_id: "sensor.next_trip",
      state: "LISBON",
      attributes: { friendly_name: "Volgende reis" },
    },
    "sensor.visited_countries": {
      entity_id: "sensor.visited_countries",
      state:
        "NL, BE, DE, GB, IS, MA, EG, ZA, KE, US, CA, MX, BR, AR, JP, TH, ID, AU",
      attributes: { friendly_name: "Bezochte landen" },
    },
  },
  localize: (key: string) => key,
};

card.hass = hass;

const world = document.getElementById("world") as HTMLElement & {
  setConfig: (c: unknown) => void;
  hass: unknown;
};

if (world) {
  world.setConfig({
    type: "custom:smaail-world-card",
    caption: "worldmap",
    countries_entity: "sensor.visited_countries",
  });
  world.hass = hass;
}
