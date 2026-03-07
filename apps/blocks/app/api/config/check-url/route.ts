/**
 * POST /api/config/check-url — Validate that a URL source is reachable and returns valid blocks.
 */
export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };

    if (!url || typeof url !== "string") {
      return Response.json({ error: "url is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) {
        return Response.json(
          { reachable: false, error: `Server returned ${res.status}` },
        );
      }

      const data: unknown = await res.json();

      if (!Array.isArray(data)) {
        return Response.json(
          { reachable: true, valid: false, error: "Response is not a JSON array" },
        );
      }

      const validCount = data.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "name" in item &&
          "slug" in item &&
          "tree" in item,
      ).length;

      return Response.json({
        reachable: true,
        valid: true,
        blockCount: validCount,
        totalItems: data.length,
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      const message =
        fetchErr instanceof DOMException && fetchErr.name === "AbortError"
          ? "Request timed out"
          : "Could not reach URL";
      return Response.json({ reachable: false, error: message });
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
