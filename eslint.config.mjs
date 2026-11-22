// ESLint zoals in de Home Assistant-frontend (zijn eslint.config.mjs, november 2026): dezelfde
// plugins, en zijn regels in eslint-ha.json, zonder de delen die alleen voor de frontend-repo zelf
// gelden (de webpack-resolver, de eigen "ha"-regels en de history-hulpjes).
import { readFileSync } from "node:fs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { configs as litConfigs } from "eslint-plugin-lit";
import { configs as wcConfigs } from "eslint-plugin-wc";
import { configs as a11yConfigs } from "eslint-plugin-lit-a11y";
import html from "@html-eslint/eslint-plugin";
import {
  createNodeResolver,
  flatConfigs as importXConfigs,
} from "eslint-plugin-import-x";

const ha = JSON.parse(
  readFileSync(new URL("./eslint-ha.json", import.meta.url), "utf8")
);

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  eslintConfigPrettier,
  litConfigs["flat/all"],
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  wcConfigs["flat/recommended"],
  a11yConfigs.recommended,
  importXConfigs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
    },

    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },

    // In plaats van de webpack-resolver van de frontend: "./font" wordt src/font.ts.
    settings: {
      "import-x/resolver-next": [
        createNodeResolver({ extensions: [".ts", ".js", ".mjs"] }),
      ],
    },

    rules: ha.rules,
  },
  {
    // De build-config en dit bestand draaien in Node.js, niet in de browser.
    files: ["vite.config.ts", "eslint.config.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    plugins: {
      html,
    },
    rules: {
      "html/no-invalid-attr-value": "error",
    },
  }
);
