import * as vscode from "vscode";
import { constants } from "./constants";

export function activate(context: vscode.ExtensionContext): void {
  if (context.globalState.get("installed") !== true) {
    vscode.window.showInformationMessage(`${constants.extension.displayName} is installed!`);
    context.globalState.update("installed", true);
  }
}

export function deactivate() {}
