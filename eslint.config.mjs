// ESLint as in the Home Assistant frontend (its eslint.config.mjs, November 2026): the same
// plugins, and its rules in eslint-ha.json, without the parts that only apply to the frontend
// repository itself (the webpack resolver, its own "ha" rules and the history helpers).
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

    // Instead of the frontend's webpack resolver: resolve "./font" to src/font.ts.
    settings: {
      "import-x/resolver-next": [
        createNodeResolver({ extensions: [".ts", ".js", ".mjs"] }),
      ],
    },

    rules: ha.rules,
  },
  {
    // Build config and this file run in Node.js, not in the browser.
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
