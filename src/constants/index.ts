import * as manifest from "../../package.json";
import { IPackageManifest } from "../models/packageManifest";

export const constants = {
  environment: { production: false },
  extension: {
    name: "extended-jetbrains-icons-for-vscode",
    version: (manifest as IPackageManifest).version,
  },
};
