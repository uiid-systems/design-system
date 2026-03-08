import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { z } from "zod";

export const SourceEntrySchema = z.object({
  type: z.enum(["bundled", "local", "url"]),
  path: z.string().optional(),
  label: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  mode: z.enum(["read", "read-write"]).default("read"),
  enabled: z.boolean().default(true),
});

export const BlocksConfigSchema = z.object({
  sources: z.array(SourceEntrySchema),
});

export type SourceEntry = z.infer<typeof SourceEntrySchema>;
export type BlocksConfig = z.infer<typeof BlocksConfigSchema>;
export type SourceMeta = Pick<SourceEntry, "label" | "description" | "author">;

const CONFIG_FILENAME = "blocks.config.json";

function getConfigPath(): string {
  return join(process.cwd(), CONFIG_FILENAME);
}

const DEFAULT_CONFIG: BlocksConfig = {
  sources: [
    {
      type: "bundled",
      label: "Built-in Blocks",
      mode: "read",
      enabled: true,
    },
    {
      type: "local",
      path: "./blocks",
      label: "Local Blocks",
      mode: "read-write",
      enabled: true,
    },
  ],
};

export async function readConfig(): Promise<BlocksConfig> {
  const configPath = getConfigPath();
  try {
    const raw = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw);
    return BlocksConfigSchema.parse(parsed);
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
    await writeConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export async function getWritableSourcePath(): Promise<string | null> {
  const config = await readConfig();
  const writable = config.sources.find(
    (s) => s.enabled && s.type === "local" && s.mode === "read-write" && s.path,
  );
  if (!writable?.path) return null;
  return resolve(process.cwd(), writable.path);
}

export async function writeConfig(config: BlocksConfig): Promise<void> {
  const validated = BlocksConfigSchema.parse(config);
  const configPath = getConfigPath();
  await writeFile(configPath, JSON.stringify(validated, null, 2) + "\n", "utf-8");
}
