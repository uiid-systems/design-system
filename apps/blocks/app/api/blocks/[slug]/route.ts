import { getDefaultManager } from "../../../../lib/sources";

/**
 * GET /api/blocks/[slug] — Read a single block by slug from configured sources.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const manager = getDefaultManager();
  const block = await manager.get(slug);

  if (!block) {
    return Response.json({ error: "Block not found" }, { status: 404 });
  }

  return Response.json(block);
}
