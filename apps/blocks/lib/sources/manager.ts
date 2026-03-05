import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

export class BlockSourceManager {
  private sources: BlockSource[] = [];

  addSource(source: BlockSource): void {
    this.sources.push(source);
  }

  async list(): Promise<BlockFile[]> {
    const seen = new Set<string>();
    const result: BlockFile[] = [];

    for (const source of this.sources) {
      const blocks = await source.list();
      for (const block of blocks) {
        if (!seen.has(block.slug)) {
          seen.add(block.slug);
          result.push(block);
        }
      }
    }

    return result;
  }

  async get(slug: string): Promise<BlockFile | null> {
    for (const source of this.sources) {
      const block = await source.get(slug);
      if (block) return block;
    }
    return null;
  }
}
