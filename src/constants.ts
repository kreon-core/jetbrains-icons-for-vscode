import * as manifest from "@root/package.json";
import { IPackageManifest } from "@models/package_manifest";

const pkg: IPackageManifest = manifest as IPackageManifest;

export const constants = {
  environment: { production: false },
  extension: { name: pkg.name, displayName: pkg.displayName, version: pkg.version }
};
