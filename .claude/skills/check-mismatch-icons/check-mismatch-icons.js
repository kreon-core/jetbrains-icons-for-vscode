#!/usr/bin/env node
// Run from repo root: node .claude/scripts/check-mismatch-icons.js
const fs = require("fs");
const path = require("path");

const fileIconDefs = JSON.parse(fs.readFileSync("icons/file-icons.json", "utf8"));
const folderIconDefs = JSON.parse(fs.readFileSync("icons/folder-icons.json", "utf8"));
const darkFileTheme = JSON.parse(fs.readFileSync("icons/file-icon-theme-dark-mode.json", "utf8"));
const lightFileTheme = JSON.parse(fs.readFileSync("icons/file-icon-theme-light-mode.json", "utf8"));
const darkFolderTheme = JSON.parse(
  fs.readFileSync("icons/folder-icon-theme-dark-mode.json", "utf8")
);
const lightFolderTheme = JSON.parse(
  fs.readFileSync("icons/folder-icon-theme-light-mode.json", "utf8")
);

function svgsInDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".svg"))
    .map((f) => path.join(dir, f));
}

// Check 1: SVG files on disk not referenced in definition JSONs
const fileIconPaths = Object.values(fileIconDefs).map((v) => v.iconPath);
const folderIconPaths = Object.values(folderIconDefs).map((v) => v.iconPath);

const check1 = [];
for (const svg of [...svgsInDir("assets/file/light"), ...svgsInDir("assets/file/dark")]) {
  if (!fileIconPaths.includes("../" + svg)) check1.push(svg + "  (missing from file-icons.json)");
}
for (const svg of [...svgsInDir("assets/folder/light"), ...svgsInDir("assets/folder/dark")]) {
  if (!folderIconPaths.includes("../" + svg))
    check1.push(svg + "  (missing from folder-icons.json)");
}

// Check 2: Definition entries pointing to missing SVG files
const check2 = [];
for (const [key, val] of Object.entries(fileIconDefs)) {
  const resolved = path.join("icons", val.iconPath);
  if (!fs.existsSync(resolved))
    check2.push("file-icons.json → " + key + ": " + val.iconPath + "  (file not found)");
}
for (const [key, val] of Object.entries(folderIconDefs)) {
  const resolved = path.join("icons", val.iconPath);
  if (!fs.existsSync(resolved))
    check2.push("folder-icons.json → " + key + ": " + val.iconPath + "  (file not found)");
}

// Check 3: Theme mappings referencing undefined icon names
const allFileIconKeys = new Set(Object.keys(fileIconDefs));
const allFolderIconKeys = new Set(Object.keys(folderIconDefs));

function collectFileRefs(theme) {
  const refs = [];
  if (typeof theme.file === "string") refs.push({ sec: "file", k: "(default)", v: theme.file });
  for (const sec of ["languageIds", "fileExtensions", "fileNames"]) {
    if (theme[sec] && typeof theme[sec] === "object")
      for (const [k, v] of Object.entries(theme[sec])) refs.push({ sec, k, v });
  }
  return refs;
}

function collectFolderRefs(theme) {
  const refs = [];
  for (const sec of ["folder", "folderExpanded", "rootFolder", "rootFolderExpanded"]) {
    if (typeof theme[sec] === "string") refs.push({ sec, k: "(default)", v: theme[sec] });
  }
  for (const sec of ["folderNames", "folderNamesExpanded"]) {
    if (theme[sec] && typeof theme[sec] === "object")
      for (const [k, v] of Object.entries(theme[sec])) refs.push({ sec, k, v });
  }
  return refs;
}

const check3 = [];
for (const [filename, theme] of [
  ["file-icon-theme-dark-mode.json", darkFileTheme],
  ["file-icon-theme-light-mode.json", lightFileTheme]
]) {
  for (const { sec, k, v } of collectFileRefs(theme)) {
    if (!allFileIconKeys.has(v))
      check3.push(
        filename + " → " + sec + "." + k + ": " + v + "  (not defined in file-icons.json)"
      );
  }
}
for (const [filename, theme] of [
  ["folder-icon-theme-dark-mode.json", darkFolderTheme],
  ["folder-icon-theme-light-mode.json", lightFolderTheme]
]) {
  for (const { sec, k, v } of collectFolderRefs(theme)) {
    if (!allFolderIconKeys.has(v))
      check3.push(
        filename + " → " + sec + "." + k + ": " + v + "  (not defined in folder-icons.json)"
      );
  }
}

// Check 4: Light/dark symmetry gaps
const check4 = [];
const fileKeys = Object.keys(fileIconDefs);
const folderKeys = Object.keys(folderIconDefs);

for (const key of fileKeys) {
  if (!key.endsWith("_dark") && !fileKeys.includes(key + "_dark"))
    check4.push("file-icons.json → " + key + "  (has light, missing " + key + "_dark)");
  if (key.endsWith("_dark") && !fileKeys.includes(key.slice(0, -5)))
    check4.push(
      "file-icons.json → " + key + "  (has dark, missing " + key.slice(0, -5) + " light)"
    );
}
for (const key of folderKeys) {
  if (!key.endsWith("_dark") && !folderKeys.includes(key + "_dark"))
    check4.push("folder-icons.json → " + key + "  (has light, missing " + key + "_dark)");
  if (key.endsWith("_dark") && !folderKeys.includes(key.slice(0, -5)))
    check4.push(
      "folder-icons.json → " + key + "  (has dark, missing " + key.slice(0, -5) + " light)"
    );
}

// Report
function section(title, items) {
  console.log("\n=== " + title + " ===");
  if (items.length === 0) console.log("  (none)");
  else items.forEach((i) => console.log("  " + i));
}

section("Check 1: SVG files not registered", check1);
section("Check 2: Broken iconPath references", check2);
section("Check 3: Undefined icon names in theme mappings", check3);
section("Check 4: Light/dark symmetry gaps", check4);

const total = check1.length + check2.length + check3.length + check4.length;
console.log("\n=== Summary ===");
console.log("Total mismatches: " + total);
process.exit(total > 0 ? 1 : 0);
