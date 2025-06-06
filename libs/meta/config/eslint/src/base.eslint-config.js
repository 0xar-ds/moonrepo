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
      "no-undef": "off",
      "import-x/order": [
        "error",
        makeImportXOrderRuleDefinition()
      ]
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json'
        }),
        createNodeResolver()
      ],
    },
  }
);

/**
 * @returns {import('eslint-plugin-import-x/rules/order').Options}
 */
function makeImportXOrderRuleDefinition() {
  return {
    groups: [
      "builtin",
      "external", 
      "object",
      "internal",
      ["parent", "sibling"],
      "index",
      "type"
    ],
    pathGroups: [
      {
        pattern: "#**/**",
        group: "internal",
        position: "before",
      },
      {
        pattern: "@~**/**",
        group: "external",
        position: "after",
      }
    ],
    pathGroupsExcludedImportTypes: ["builtin"],
    
    sortTypesGroup: true,

    "newlines-between": "always-and-inside-groups",
    "newlines-between-types": "always-and-inside-groups",

    named: true,

    alphabetize: {
      order: "asc",
      orderImportKind: "ignore",
      caseInsensitive: true,
    },

    consolidateIslands: "inside-groups",
    
  }
}