import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { z } from "zod";

export const SourceEntrySchema = z.object({
  type: z.enum(["bundled", "local", "url"]),
  path: z.string().optional(),
  label: z.string(),
  mode: z.enum(["read", "read-write"]).default("read"),
  enabled: z.boolean().default(true),
});

export const BlocksConfigSchema = z.object({
  sources: z.array(SourceEntrySchema),
});

export type SourceEntry = z.infer<typeof SourceEntrySchema>;
export type BlocksConfig = z.infer<typeof BlocksConfigSchema>;

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
  } catch {
    await writeConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export async function writeConfig(config: BlocksConfig): Promise<void> {
  const validated = BlocksConfigSchema.parse(config);
  const configPath = getConfigPath();
  await writeFile(configPath, JSON.stringify(validated, null, 2) + "\n", "utf-8");
}
