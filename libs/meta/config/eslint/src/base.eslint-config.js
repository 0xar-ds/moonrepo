import js from "@eslint/js";
import ts from "typescript-eslint";

import tsParser from "@typescript-eslint/parser";

import prettier from "eslint-config-prettier/flat";

import imports, { createNodeResolver } from "eslint-plugin-import-x";

import globals from "globals";

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

export default ts.config(
  js.configs.recommended, 
  ts.configs.recommended,
  ts.configs.stylistic,
  prettier,
  imports.flatConfigs.recommended,
  imports.flatConfigs.typescript,
  {
    // extends: [moon],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: { ...globals.node },
      parserOptions: {
        parser: tsParser
      }
    },
    rules: { 
      "no-undef": "off"
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
        createNodeResolver()
      ]
    }
  }
);
