---
name: check-mismatch-icons
description: Audit icon consistency across the four layers of the icon theme pipeline — SVG files, definition JSONs, theme mappings, and light/dark symmetry. Reports all mismatches without auto-fixing.
disable-model-invocation: true
---

# Skill: check-mismatch-icons

Audit icon consistency across the four layers of the icon theme pipeline and report all mismatches. Do not auto-fix anything unless the user explicitly asks.

## What to check

Run all four checks below and produce a single consolidated report at the end.

### 1. SVG files not registered in icons definition files

Collect every `.svg` basename (without extension) from:

- `assets/file/light/` and `assets/file/dark/`
- `assets/folder/light/` and `assets/folder/dark/`

Then read `icons/file-icons.json` and `icons/folder-icons.json` and extract every `iconPath` value.

Report SVG files on disk whose path does not appear in any `iconPath` value in the relevant definition JSON.

### 2. Icons definition entries pointing to missing SVG files

For every entry in `icons/file-icons.json` and `icons/folder-icons.json`, resolve the `iconPath` relative to the `icons/` directory (i.e., prepend `assets/` appropriately) and check whether that file actually exists on disk.

Report any entries whose target SVG file is missing.

### 3. Theme mapping references to undefined icon names

Read all four theme mapping files:

- `icons/file-icon-theme-light-mode.json`
- `icons/file-icon-theme-dark-mode.json`
- `icons/folder-icon-theme-light-mode.json`
- `icons/folder-icon-theme-dark-mode.json`

Collect every icon name value (e.g. `"_typescript_dark"`) referenced under `file`, `languageIds`, `fileExtensions`, `fileNames` (and the folder equivalents: `folder`, `folderExpanded`, `rootFolder`, `rootFolderExpanded`, `folderNames`, `folderNamesExpanded`).

Cross-reference against all keys defined in `icons/file-icons.json` and `icons/folder-icons.json`.

Report any referenced icon name that has no definition.

### 4. Light/dark symmetry gaps in definition files

For every non-`_dark` key in `icons/file-icons.json`, check that a corresponding `<key>_dark` entry exists (and vice-versa). Do the same for `icons/folder-icons.json`.

Report any icon that has a light definition but no dark counterpart, or a dark definition but no light counterpart.

## How to execute the checks

A ready-to-run script lives at `.claude/skills/check-mismatch-icons/check-mismatch-icons.js`. Run it from the repo root with:

```bash
node .claude/skills/check-mismatch-icons/check-mismatch-icons.js
```

It performs all four checks in one pass and exits with code 1 if any mismatches are found, 0 if clean. Do not re-generate the script inline — use the file directly.

## Output format

Print a report with one section per check. Use this structure:

```
=== Check 1: SVG files not registered ===
  assets/file/dark/example.svg  (missing from file-icons.json)
  (none)

=== Check 2: Broken iconPath references ===
  file-icons.json → _foo: ../assets/file/light/foo.svg  (file not found)
  (none)

=== Check 3: Undefined icon names in theme mappings ===
  file-icon-theme-dark-mode.json → fileExtensions.xyz: _xyz_dark  (not defined)
  (none)

=== Check 4: Light/dark symmetry gaps ===
  file-icons.json → _bar  (has light, missing _bar_dark)
  (none)

=== Summary ===
Total mismatches: N
```

If a section has no findings, print `  (none)` under the heading.

## After running

- Present the full report to the user.
- If mismatches exist, ask the user which ones they want to fix before taking any action.
- Do not auto-fix, auto-add, or auto-delete any files or JSON entries unless the user explicitly instructs you to.
