import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

export class LocalDirectorySource implements BlockSource {
  readonly name: string;
  private readonly dir: string;

  constructor(dir: string, name?: string) {
    this.dir = dir;
    this.name = name ?? `local:${dir}`;
  }

  async list(): Promise<BlockFile[]> {
    return this.readJsonFiles();
  }

  async get(slug: string): Promise<BlockFile | null> {
    const files = await this.readJsonFiles();
    return files.find((f) => f.slug === slug) ?? null;
  }

  private async readJsonFiles(): Promise<BlockFile[]> {
    let entries: string[];
    try {
      entries = await readdir(this.dir);
    } catch {
      return [];
    }

    const jsonFiles = entries.filter((f) => f.endsWith(".json"));
    const results: BlockFile[] = [];

    for (const file of jsonFiles) {
      try {
        const raw = await readFile(join(this.dir, file), "utf-8");
        const parsed = JSON.parse(raw) as BlockFile;
        if (parsed.name && parsed.slug && parsed.tree) {
          results.push(parsed);
        }
      } catch {
        // Skip malformed files
      }
    }

    return results;
  }
}
