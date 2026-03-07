import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import JSZip from "jszip";

import { readConfig, writeConfig } from "../../../../lib/sources";
import type { SourceEntry } from "../../../../lib/sources";

/**
 * POST /api/blocks/import — Import a .zip file as a new local block source.
 *
 * Accepts multipart/form-data with a "file" field containing the zip.
 * Unpacks JSON block files to a local directory and adds it as a source.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "A zip file is required in the 'file' field" },
        { status: 400 },
      );
    }

    if (!file.name.endsWith(".zip")) {
      return Response.json(
        { error: "File must be a .zip archive" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Read registry metadata if present
    let label = file.name.replace(/\.zip$/, "");
    let description: string | undefined;
    let author: string | undefined;

    const metaFile = zip.file("registry.json");
    if (metaFile) {
      try {
        const metaText = await metaFile.async("string");
        const meta = JSON.parse(metaText);
        if (meta.label) label = meta.label;
        if (meta.description) description = meta.description;
        if (meta.author) author = meta.author;
      } catch {
        // Ignore malformed registry.json
      }
    }

    // Create a safe directory name from the label
    const dirName = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const targetDir = resolve(process.cwd(), "blocks-imported", dirName);
    await mkdir(targetDir, { recursive: true });

    // Extract all .json block files (skip registry.json)
    let blockCount = 0;
    const entries = Object.entries(zip.files);

    for (const [path, entry] of entries) {
      if (entry.dir) continue;
      if (path === "registry.json") continue;
      if (!path.endsWith(".json")) continue;

      const content = await entry.async("string");

      // Validate it looks like a block file
      try {
        const parsed = JSON.parse(content);
        if (!parsed.name || !parsed.slug || !parsed.tree) continue;
      } catch {
        continue;
      }

      const fileName = path.split("/").pop()!;
      await writeFile(join(targetDir, fileName), content, "utf-8");
      blockCount++;
    }

    if (blockCount === 0) {
      return Response.json(
        { error: "No valid block files found in the archive" },
        { status: 400 },
      );
    }

    // Add as a new source in the config
    const config = await readConfig();
    const relativePath = `./blocks-imported/${dirName}`;

    // Check if a source with this path already exists
    const existing = config.sources.find(
      (s) => s.type === "local" && s.path === relativePath,
    );

    if (!existing) {
      const newSource: SourceEntry = {
        type: "local",
        path: relativePath,
        label,
        mode: "read",
        enabled: true,
      };
      if (description) newSource.description = description;
      if (author) newSource.author = author;

      config.sources.push(newSource);
      await writeConfig(config);
    }

    return Response.json(
      {
        label,
        path: relativePath,
        blockCount,
        isNew: !existing,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to import archive",
      },
      { status: 500 },
    );
  }
}
