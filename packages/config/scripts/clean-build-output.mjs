#!/usr/bin/env node
// First step of every package build: deletes the package's dist and its
// `tsc -b` build info. `tsc` and Vite both write into dist and neither empties
// it, so without this a file whose source was renamed or deleted keeps its old
// output and ships in the tarball. The build info goes too: it lives outside
// dist (see tsconfig.package.json), and if it survived, `tsc -b` would find
// nothing changed and skip writing the declarations just deleted.

import { rmSync } from "node:fs";

for (const path of ["dist", "node_modules/.tmp/tsconfig.tsbuildinfo"]) {
  rmSync(path, { recursive: true, force: true });
}
