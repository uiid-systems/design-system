import { blocks } from "@uiid/blocks";
import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

export class BundledSource implements BlockSource {
  readonly name = "bundled";

  async list(): Promise<BlockFile[]> {
    return Object.values(blocks);
  }

  async get(slug: string): Promise<BlockFile | null> {
    return blocks[slug] ?? null;
  }
}
