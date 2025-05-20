import js from "@eslint/js";
import ts from "typescript-eslint";

import svelte from "eslint-plugin-svelte";

import prettier from "eslint-config-prettier/flat";

import imports from "eslint-plugin-import-x";

import globals from "globals";

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

export default ts.config(
  js.configs.recommended, 
  ts.configs.recommended,
  ts.configs.stylistic,
  prettier,
  imports.flatConfigs.recommended,
  imports.flatConfigs.typescript,
  svelte.configs.recommended,
  svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true
        })
      ]
    },
    rules: {
      // security & possible errors
      
      // best practices

      "svelte/require-optimized-style-attribute": "error",
      "svelte/prefer-destructured-store-props": "error",
      "svelte/require-each-key": "error",

      "svelte/no-ignored-unsubscribe": "warn",

      // style
      
      "svelte/no-spaces-around-equal-signs-in-attribute": "error",
      "svelte/derived-has-same-inputs-outputs": "error",
      "svelte/html-closing-bracket-new-line": "error",
      // "svelte/html-closing-bracket-spacing": "error",
      "svelte/html-quotes": ["error", { prefer: "double", dynamic: { quoted: true, avoidInvalidUnquotedInHTML: true } } ],
      "svelte/html-self-closing": ["error", "default"],
      "svelte/indent": ["error", { "indent": 2, "ignoredNodes": [], "switchCase": 1, "alignAttributesVertically": true } ],
      "svelte/first-attribute-linebreak": "error",
      "svelte/max-attributes-per-line": "error",
      "svelte/prefer-class-directive": "error",
      "svelte/prefer-style-directive": "error",
      "svelte/spaced-html-comment": "error",
      "svelte/no-trailing-spaces": "error",
      "svelte/shorthand-directive": "error",
      "svelte/shorthand-attribute": "error",
      "svelte/mustache-spacing": "error",
      "svelte/sort-attributes": "error",
    }
  }
);
