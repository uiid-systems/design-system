import { readConfig, writeConfig, BlocksConfigSchema } from "../../../lib/sources";

/**
 * GET /api/config — Read the current blocks configuration.
 */
export async function GET() {
  const config = await readConfig();
  return Response.json(config);
}

/**
 * PUT /api/config — Update the blocks configuration.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const config = BlocksConfigSchema.parse(body);
    await writeConfig(config);
    return Response.json(config);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid config" },
      { status: 400 },
    );
  }
}
