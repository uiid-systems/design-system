import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

import { blocks, slugify } from "@uiid/blocks";
import type { BlockFile } from "@uiid/blocks";

const BLOCKS_DIR = join(process.cwd(), "blocks");

/**
 * GET /api/blocks — List all block files from the @uiid/blocks package.
 */
export async function GET() {
  const allBlocks = Object.values(blocks);
  allBlocks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return Response.json(allBlocks);
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
      category: body.category || "content",
      components: body.components || [],
      complexity: body.complexity || "low",
      elementCount: body.elementCount || 0,
      tree: body.tree,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await mkdir(BLOCKS_DIR, { recursive: true });
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
