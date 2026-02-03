import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { BlockFile } from "@/lib/block-file";
import { slugify } from "@/lib/block-file";

const BLOCKS_DIR = join(process.cwd(), "blocks");

/**
 * GET /api/blocks — List all exported block files.
 */
export async function GET() {
  try {
    const files = await readdir(BLOCKS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const blocks: BlockFile[] = [];
    for (const file of jsonFiles) {
      const raw = await readFile(join(BLOCKS_DIR, file), "utf-8");
      blocks.push(JSON.parse(raw) as BlockFile);
    }

    blocks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return Response.json(blocks);
  } catch {
    return Response.json([]);
  }
}

/**
 * POST /api/blocks — Export a block to a JSON file.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BlockFile;

    if (!body.name || !body.tree) {
      return Response.json({ error: "name and tree are required" }, { status: 400 });
    }

    const slug = body.slug || slugify(body.name);
    const block: BlockFile = {
      name: body.name,
      slug,
      description: body.description || "",
      version: body.version || 1,
      tags: body.tags || [],
      tree: body.tree,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const filePath = join(BLOCKS_DIR, `${slug}.json`);
    await writeFile(filePath, JSON.stringify(block, null, 2) + "\n", "utf-8");

    return Response.json(block, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save block" },
      { status: 500 },
    );
  }
}
