import { blocks } from "@uiid/blocks";

/**
 * GET /api/blocks/[slug] — Read a single block by slug from the @uiid/blocks package.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const block = blocks[slug];

  if (!block) {
    return Response.json({ error: "Block not found" }, { status: 404 });
  }

  return Response.json(block);
}
