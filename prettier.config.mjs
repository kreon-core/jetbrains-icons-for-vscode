/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  tabWidth: 2, // spaces per tab
  useTabs: false, // use spaces instead of tabs
  printWidth: 100, // max line length
  semi: true, // add semicolons
  singleQuote: false, // use double quotes
  jsxSingleQuote: false, // use double quotes in JSX
  quoteProps: "as-needed", // only add quotes to object properties when necessary
  trailingComma: "none", // no trailing commas
  bracketSpacing: true, // spaces inside object literals
  objectWrap: "collapse", // wrap objects when necessary
  bracketSameLine: false, // put > of multi-line JSX elements on its own line
  arrowParens: "always", // always include parens in arrow functions
  endOfLine: "lf" // use LF for line endings
};

export default config;
