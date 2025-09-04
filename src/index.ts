import * as vscode from "vscode";
import { constants } from "./constants";

export function activate(_context: vscode.ExtensionContext): void {
  console.info(
    `[${constants.extension.name}] v${constants.extension.version} is now active!`
  );
}

export function deactivate() {}
