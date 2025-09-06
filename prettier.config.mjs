"use strict";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "none",
  bracketSpacing: true,
  objectWrap: "collapse",
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf"
};

export default config;
