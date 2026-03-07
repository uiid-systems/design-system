import JSZip from "jszip";

import { createManagerFromConfig, readConfig } from "../../../../lib/sources";

/**
 * GET /api/blocks/export?source=Label — Export a source's blocks as a .zip file.
 *
 * Query params:
 *   source (required) — the label of the source to export
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sourceLabel = url.searchParams.get("source");

  if (!sourceLabel) {
    return Response.json(
      { error: "source query parameter is required" },
      { status: 400 },
    );
  }

  const config = await readConfig();
  const entry = config.sources.find(
    (s) => s.enabled && s.label === sourceLabel,
  );

  if (!entry) {
    return Response.json(
      { error: `Source "${sourceLabel}" not found or not enabled` },
      { status: 404 },
    );
  }

  const manager = await createManagerFromConfig();
  const { blocks } = await manager.list();
  const sourceBlocks = blocks.filter((b) => b._source === sourceLabel);

  if (sourceBlocks.length === 0) {
    return Response.json(
      { error: `No blocks found in source "${sourceLabel}"` },
      { status: 404 },
    );
  }

  const zip = new JSZip();

  // Add registry metadata if available
  const meta: Record<string, string> = { label: entry.label };
  if (entry.description) meta.description = entry.description;
  if (entry.author) meta.author = entry.author;
  zip.file("registry.json", JSON.stringify(meta, null, 2) + "\n");

  // Add each block as a JSON file (strip _source before export)
  for (const block of sourceBlocks) {
    const { _source, ...blockData } = block;
    zip.file(`${block.slug}.json`, JSON.stringify(blockData, null, 2) + "\n");
  }

  const uint8 = await zip.generateAsync({ type: "uint8array" });
  const safeName = sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return new Response(uint8.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeName}-blocks.zip"`,
    },
  });
}
