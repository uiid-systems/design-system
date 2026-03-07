import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

export type BlockFileWithSource = BlockFile & {
  _source: string;
};

export type SourceError = {
  source: string;
  error: string;
};

export type ListResult = {
  blocks: BlockFileWithSource[];
  errors: SourceError[];
};

export class BlockSourceManager {
  private sources: BlockSource[] = [];

  addSource(source: BlockSource): void {
    this.sources.push(source);
  }

  async list(): Promise<ListResult> {
    const seen = new Set<string>();
    const blocks: BlockFileWithSource[] = [];
    const errors: SourceError[] = [];

    for (const source of this.sources) {
      try {
        const sourceBlocks = await source.list();
        for (const block of sourceBlocks) {
          if (!seen.has(block.slug)) {
            seen.add(block.slug);
            blocks.push({ ...block, _source: source.name });
          }
        }
      } catch (err) {
        errors.push({
          source: source.name,
          error: err instanceof Error ? err.message : "Failed to load blocks",
        });
      }
    }

    return { blocks, errors };
  }

  async get(slug: string): Promise<BlockFileWithSource | null> {
    for (const source of this.sources) {
      try {
        const block = await source.get(slug);
        if (block) return { ...block, _source: source.name };
      } catch {
        // Skip failed sources, try next
      }
    }
    return null;
  }
}
