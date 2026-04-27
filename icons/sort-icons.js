// @ts-check
const fs = require("fs");
const path = require("path");

const ICONS_DIR = __dirname;

/**
 * @param {Record<string, unknown>} obj
 */
function sortKeys(obj) {
  return Object.fromEntries(
    Object.keys(obj)
      .sort()
      .map((k) => [k, obj[k]])
  );
}

// Sort flat definition files (file-icons.json, folder-icons.json)
const defFiles = ["file-icons.json", "folder-icons.json"];
for (const file of defFiles) {
  const filePath = path.join(ICONS_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const sorted = sortKeys(data);
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Sorted ${file}`);
}

// Sort theme mapping files — keep top-level scalar fields first, sort each section
const themeFiles = [
  "file-icon-theme-dark-mode.json",
  "file-icon-theme-light-mode.json",
  "folder-icon-theme-dark-mode.json",
  "folder-icon-theme-light-mode.json"
];
const SECTION_KEYS = [
  "languageIds",
  "fileExtensions",
  "fileNames",
  "folderNames",
  "folderNamesExpanded"
];

for (const file of themeFiles) {
  const filePath = path.join(ICONS_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  /** @type {Record<string, unknown>} */
  const sorted = {};
  // Scalar fields first (e.g. "file", "folder", "rootFolder", "hidesExplorerArrows")
  for (const [k, v] of Object.entries(data)) {
    if (!SECTION_KEYS.includes(k)) sorted[k] = v;
  }
  // Then each section, with keys sorted
  for (const section of SECTION_KEYS) {
    if (data[section]) sorted[section] = sortKeys(data[section]);
  }

  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Sorted ${file}`);
}
