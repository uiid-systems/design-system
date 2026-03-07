import { describe, it, expect, vi, beforeEach } from "vitest";

import { RemoteUrlSource } from "../remote-url";

const VALID_BLOCK = {
  name: "Remote Block",
  slug: "remote-block",
  description: "A remote block",
  version: 1,
  tags: [],
  category: "content",
  components: [],
  complexity: "low",
  elementCount: 1,
  tree: { root: "r", elements: { r: { key: "r", type: "Box", props: {} } } },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const BASE_URL = "http://test.local/blocks.json";

function mockFetch(body: unknown, options?: { status?: number; headers?: Record<string, string> }) {
  const status = options?.status ?? 200;
  const headers = new Headers(options?.headers);
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => body,
  });
}

function mockFetchError() {
  return vi.fn().mockRejectedValue(new TypeError("Network error"));
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RemoteUrlSource", () => {
  it("fetches and returns blocks from a URL", async () => {
    vi.stubGlobal("fetch", mockFetch([VALID_BLOCK]));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].slug).toBe("remote-block");
  });

  it("gets a block by slug", async () => {
    vi.stubGlobal("fetch", mockFetch([VALID_BLOCK]));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const block = await source.get("remote-block");
    expect(block).not.toBeNull();
    expect(block?.name).toBe("Remote Block");
  });

  it("returns null for missing slug", async () => {
    vi.stubGlobal("fetch", mockFetch([VALID_BLOCK]));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    expect(await source.get("nonexistent")).toBeNull();
  });

  it("returns empty array on network error", async () => {
    vi.stubGlobal("fetch", mockFetchError());

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toEqual([]);
  });

  it("returns empty array on non-200 response", async () => {
    vi.stubGlobal("fetch", mockFetch(null, { status: 500 }));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toEqual([]);
  });

  it("returns empty array on malformed JSON response", async () => {
    vi.stubGlobal("fetch", mockFetch({ notAnArray: true }));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toEqual([]);
  });

  it("skips items missing required fields", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        VALID_BLOCK,
        { name: "No slug or tree" },
        { slug: "no-name", tree: {} },
      ]),
    );

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].slug).toBe("remote-block");
  });

  it("returns stale cache on network error after successful fetch", async () => {
    const successFetch = mockFetch([VALID_BLOCK]);
    vi.stubGlobal("fetch", successFetch);

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);

    // Second fetch fails — should return stale cache
    vi.stubGlobal("fetch", mockFetchError());
    const stale = await source.list();
    expect(stale).toHaveLength(1);
    expect(stale[0].slug).toBe("remote-block");
  });

  it("uses TTL cache to avoid refetching", async () => {
    const fetchMock = mockFetch([VALID_BLOCK]);
    vi.stubGlobal("fetch", fetchMock);

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 60_000 });
    await source.list();
    await source.list();
    await source.list();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("respects 304 Not Modified with ETag", async () => {
    // First fetch returns blocks with ETag
    const firstFetch = mockFetch([VALID_BLOCK], {
      headers: { etag: '"abc"' },
    });
    vi.stubGlobal("fetch", firstFetch);

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    const first = await source.list();
    expect(first).toHaveLength(1);

    // Second fetch returns 304
    const secondFetch = mockFetch(null, { status: 304 });
    vi.stubGlobal("fetch", secondFetch);

    const second = await source.list();
    expect(second).toHaveLength(1);
    expect(second[0].slug).toBe("remote-block");

    // Verify If-None-Match header was sent
    const call = secondFetch.mock.calls[0];
    expect(call[1]?.headers?.["If-None-Match"]).toBe('"abc"');
  });

  it("returns stale cache on non-200 response after successful fetch", async () => {
    vi.stubGlobal("fetch", mockFetch([VALID_BLOCK]));

    const source = new RemoteUrlSource(BASE_URL, "test", { ttlMs: 0 });
    await source.list();

    vi.stubGlobal("fetch", mockFetch(null, { status: 500 }));
    const stale = await source.list();
    expect(stale).toHaveLength(1);
  });

  it("uses custom name when provided", () => {
    const source = new RemoteUrlSource(BASE_URL, "My Remote");
    expect(source.name).toBe("My Remote");
  });

  it("defaults name to url:{url}", () => {
    const source = new RemoteUrlSource(BASE_URL);
    expect(source.name).toBe(`url:${BASE_URL}`);
  });
});
