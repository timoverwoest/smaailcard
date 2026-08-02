import { defineConfig } from "vite";

// Two modes in one config:
//  - `vite` (dev server) serves index.html + src/dev.ts as a mock harness.
//  - `vite build` produces a single ES bundle at dist/smaailcard.js that
//    Home Assistant / HACS loads as a Lovelace resource (Lit bundled in, no
//    external imports so it works as one self-contained file).
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
      // Bundle every dependency (Lit, custom-card-helpers) into the output.
      external: [],
      output: {
        // Inline the dynamically-imported editor so the result is ONE file.
        // HACS/HA only serves `smaailcard.js`; split chunks would 404.
        inlineDynamicImports: true,
      },
    },
  },
});
