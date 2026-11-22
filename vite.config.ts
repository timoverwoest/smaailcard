import { defineConfig } from "vite";

// Twee standen in één config:
//  - `vite` (ontwikkelserver) serveert index.html + src/dev.ts als nagebootste omgeving.
//  - `vite build` maakt één ES-bundel in dist/smaailcard.js die Home Assistant
//    (Marketplace/HACS) als dashboard-resource laadt (Lit erin gebundeld, geen
//    externe imports, dus één zelfstandig bestand).
export default defineConfig({
  build: {
    lib: {
      entry: "src/smaailcard.ts",
      formats: ["es"],
      fileName: () => "smaailcard.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2021",
    rollupOptions: {
      // Elke afhankelijkheid (Lit, custom-card-helpers) gaat mee in de bundel.
      external: [],
      output: {
        // De dynamisch geïmporteerde editor inline, zodat het één bestand blijft.
        // HA serveert alleen `smaailcard.js`; losse chunks zouden een 404 geven.
        inlineDynamicImports: true,
      },
    },
  },
});
