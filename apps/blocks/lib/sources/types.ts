import type { BlockFile } from "@uiid/blocks";

export interface BlockSource {
  readonly name: string;
  list(): Promise<BlockFile[]>;
  get(slug: string): Promise<BlockFile | null>;
}
