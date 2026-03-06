import { resolve } from "node:path";

import { BlockSourceManager } from "./manager";
import { BundledSource } from "./bundled";
import { LocalDirectorySource } from "./local-directory";
import { readConfig } from "./config";
import type { SourceEntry } from "./config";

export type { BlockSource } from "./types";
export { BlockSourceManager } from "./manager";
export { BundledSource } from "./bundled";
export { LocalDirectorySource } from "./local-directory";
export { readConfig, writeConfig, getWritableSourcePath, BlocksConfigSchema } from "./config";
export type { BlocksConfig, SourceEntry } from "./config";

function buildSource(entry: SourceEntry) {
  switch (entry.type) {
    case "bundled":
      return new BundledSource();
    case "local":
      return new LocalDirectorySource(
        resolve(process.cwd(), entry.path ?? "./blocks"),
        entry.label,
      );
    case "url":
      // Remote sources are Phase 2 (UI-92)
      return null;
  }
}

export async function createManagerFromConfig(): Promise<BlockSourceManager> {
  const config = await readConfig();
  const manager = new BlockSourceManager();

  for (const entry of config.sources) {
    if (!entry.enabled) continue;
    const source = buildSource(entry);
    if (source) manager.addSource(source);
  }

  return manager;
}
