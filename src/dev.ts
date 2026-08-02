/*
 * Dev-only harness entry. Loaded by index.html via `npm run dev`.
 * It fakes just enough of Home Assistant (a minimal <ha-card> and a `hass`
 * object with one entity) so the card renders in a plain browser — no HA
 * instance required. Never shipped: `vite build` bundles src/smaailcard.ts,
 * not this file.
 */
import "./smaailcard";

// Minimal <ha-card> stand-in: block-level rounded container with a slot.
if (!customElements.get("ha-card")) {
  customElements.define(
    "ha-card",
    class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const s = this.attachShadow({ mode: "open" });
        s.innerHTML =
          "<style>:host{display:block;border-radius:12px;" +
          "box-shadow:0 2px 8px rgba(0,0,0,.15);background:#fff;overflow:hidden;" +
          "font-family:system-ui,sans-serif}</style><slot></slot>";
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
  name: "Smaailcard",
  header: "Voorbeeld",
  entity: "sensor.demo_temperature",
});

card.hass = {
  states: {
    "sensor.demo_temperature": {
      entity_id: "sensor.demo_temperature",
      state: "21.4",
      attributes: {
        friendly_name: "Demo temperatuur",
        unit_of_measurement: "°C",
      },
    },
  },
  localize: (key: string) => key,
  formatEntityState: (stateObj: { state: string }) => stateObj.state,
};
