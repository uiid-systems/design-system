import { join } from "node:path";

import { BlockSourceManager } from "./manager";
import { BundledSource } from "./bundled";
import { LocalDirectorySource } from "./local-directory";

export type { BlockSource } from "./types";
export { BlockSourceManager } from "./manager";
export { BundledSource } from "./bundled";
export { LocalDirectorySource } from "./local-directory";

let defaultManager: BlockSourceManager | null = null;

export function getDefaultManager(): BlockSourceManager {
  if (!defaultManager) {
    defaultManager = new BlockSourceManager();
    defaultManager.addSource(new BundledSource());
    defaultManager.addSource(
      new LocalDirectorySource(join(process.cwd(), "blocks")),
    );
  }
  return defaultManager;
}
