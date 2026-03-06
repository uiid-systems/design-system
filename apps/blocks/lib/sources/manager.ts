import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

export type BlockFileWithSource = BlockFile & {
  _source: string;
};

export class BlockSourceManager {
  private sources: BlockSource[] = [];

  addSource(source: BlockSource): void {
    this.sources.push(source);
  }

  async list(): Promise<BlockFileWithSource[]> {
    const seen = new Set<string>();
    const result: BlockFileWithSource[] = [];

    for (const source of this.sources) {
      const blocks = await source.list();
      for (const block of blocks) {
        if (!seen.has(block.slug)) {
          seen.add(block.slug);
          result.push({ ...block, _source: source.name });
        }
      }
    }

    return result;
  }

  async get(slug: string): Promise<BlockFileWithSource | null> {
    for (const source of this.sources) {
      const block = await source.get(slug);
      if (block) return { ...block, _source: source.name };
    }
    return null;
  }
}
