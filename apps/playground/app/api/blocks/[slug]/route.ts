import { unlink } from "node:fs/promises";
import { join } from "node:path";

const BLOCKS_DIR = join(process.cwd(), "blocks");

/**
 * DELETE /api/blocks/[slug] — Remove a block file from the blocks/ directory.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    await unlink(join(BLOCKS_DIR, `${slug}.json`));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Block not found" }, { status: 404 });
  }
}
