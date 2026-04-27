# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Generate the icon theme JSON (must run before packaging)
npm run build

# Bump patch version in package.json (no git tag)
npm run bump

# Bundle the extension (development)
npm run compile

# Bundle the extension (production, also runs via vscode:prepublish)
npm run package

# Watch mode for development
npm run watch

# Lint
npm run lint

# Format
npm run format
```

There are no test scripts configured.

## Architecture

This is a VS Code icon theme extension that provides JetBrains-style icons for files and folders.

### How the icon theme is built

The final theme file (`icons/jetbrains-icon-theme.json`) is **generated** — never edit it directly. It is assembled by `icons/generate-icon-theme.js` from four source JSON files:

- `icons/file-icons.json` — icon definitions (name → SVG path) for file types
- `icons/folder-icons.json` — icon definitions for folder types
- `icons/file-icon-theme-light-mode.json` — maps file extensions/names to icon names (light)
- `icons/file-icon-theme-dark-mode.json` — maps file extensions/names to icon names (dark)
- `icons/folder-icon-theme-light-mode.json` / `folder-icon-theme-dark-mode.json` — same for folders

Run `npm run build` to regenerate after any changes to these source files.

### Adding a new icon

1. Add SVG files in `assets/file/light/` and `assets/file/dark/` (or `assets/folder/`).
2. Register the icon definition in `icons/file-icons.json` (or `folder-icons.json`), with both `_light` and `_dark` entries pointing to the respective SVG paths.
3. Add the file extension / filename / language mapping in the appropriate light/dark mode JSON files.
   - `fileNames` entries are **case-sensitive** — add both casings if needed (e.g. `"CLAUDE.md"` and `"claude.md"`).
4. Run `npm run build` to regenerate `icons/jetbrains-icon-theme.json`.
5. Run `npm run bump` to bump the patch version.

### Extension entry point

`src/index.ts` is intentionally minimal — it only exports `activate()` and `deactivate()`. All real functionality is declarative (icon theme registered in `package.json` under `iconThemes`). The TypeScript bundle (`dist/jetbrains-icons-for-vscode.bundle.js`) is required by VS Code but contains no meaningful logic.

### Releasing

The project uses semantic-release (configured in `package.json`) for automated versioning and GitHub releases. The CI workflow (`.github/workflows/release.yaml`) runs on every push to `main` and publishes to the VS Code Marketplace via `vsce` when a new release is detected.

Commit messages must follow Conventional Commits — this drives semantic-release version bumps:

- `feat:` → minor bump
- `fix:` → patch bump
- `BREAKING CHANGE:` → major bump

**Versioning rule:** For every small update, icon addition, fix, or tweak — run `npm run bump` to increment the patch version in `package.json` before committing. Use a `fix:` commit message so semantic-release picks it up correctly.

> Note: commitlint is not enforced by CI — follow Conventional Commits manually.
