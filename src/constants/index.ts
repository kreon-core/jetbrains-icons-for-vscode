import * as manifest from "@root/package.json" with { type: "json" };
import { IPackageManifest } from "@models/package_manifest.js";

const pkg = (manifest as { default: IPackageManifest }).default;

export const constants = {
  environment: { production: false },
  extension: { name: pkg.name, version: pkg.version }
};
