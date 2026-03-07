import type { BlockFile } from "@uiid/blocks";

import type { BlockSource } from "./types";

type CacheEntry = {
  blocks: BlockFile[];
  etag: string | null;
  fetchedAt: number;
};

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_TTL_MS = 5 * 60 * 1_000; // 5 minutes

export class RemoteUrlSource implements BlockSource {
  readonly name: string;
  private readonly url: string;
  private readonly timeoutMs: number;
  private readonly ttlMs: number;
  private cache: CacheEntry | null = null;

  constructor(
    url: string,
    name?: string,
    options?: { timeoutMs?: number; ttlMs?: number },
  ) {
    this.url = url;
    this.name = name ?? `url:${url}`;
    this.timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  async list(): Promise<BlockFile[]> {
    return this.fetchBlocks();
  }

  async get(slug: string): Promise<BlockFile | null> {
    const blocks = await this.fetchBlocks();
    return blocks.find((b) => b.slug === slug) ?? null;
  }

  private async fetchBlocks(): Promise<BlockFile[]> {
    if (this.cache && Date.now() - this.cache.fetchedAt < this.ttlMs) {
      return this.cache.blocks;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const headers: Record<string, string> = {};
      if (this.cache?.etag) {
        headers["If-None-Match"] = this.cache.etag;
      }

      const res = await fetch(this.url, {
        signal: controller.signal,
        headers,
      });
      clearTimeout(timer);

      if (res.status === 304 && this.cache) {
        this.cache.fetchedAt = Date.now();
        return this.cache.blocks;
      }

      if (!res.ok) {
        return this.cache?.blocks ?? [];
      }

      const data: unknown = await res.json();
      const blocks = this.parseBlocks(data);
      const etag = res.headers.get("etag");

      this.cache = { blocks, etag, fetchedAt: Date.now() };
      return blocks;
    } catch {
      // Network error, timeout, etc. — return stale cache or empty
      return this.cache?.blocks ?? [];
    }
  }

  private parseBlocks(data: unknown): BlockFile[] {
    if (!Array.isArray(data)) return [];

    const blocks: BlockFile[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === "object" &&
        "name" in item &&
        "slug" in item &&
        "tree" in item
      ) {
        blocks.push(item as BlockFile);
      }
    }
    return blocks;
  }
}
