import fs from "fs";
import path from "path";

export type Changeset = {
  id: string;
  packages: { name: string; bump: string }[];
  summary: string;
};

const CHANGESET_DIR = path.resolve(process.cwd(), "../../.changeset");

/**
 * Parse a single changeset markdown file into structured data.
 */
function parseChangeset(filename: string, content: string): Changeset | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const [, frontmatter, body] = match;
  const packages: Changeset["packages"] = [];

  for (const line of frontmatter.trim().split("\n")) {
    const pkgMatch = line.match(/^"(.+)":\s*(patch|minor|major)$/);
    if (pkgMatch) {
      packages.push({ name: pkgMatch[1], bump: pkgMatch[2] });
    }
  }

  if (packages.length === 0) return null;

  return {
    id: filename.replace(/\.md$/, ""),
    packages,
    summary: body.trim(),
  };
}

/**
 * Read all pending changesets from the .changeset directory.
 */
export function getChangesets(): Changeset[] {
  try {
    const files = fs.readdirSync(CHANGESET_DIR);
    return files
      .filter((f) => f.endsWith(".md") && f !== "README.md")
      .map((f) => {
        const content = fs.readFileSync(path.join(CHANGESET_DIR, f), "utf8");
        return parseChangeset(f, content);
      })
      .filter((c): c is Changeset => c !== null)
      .sort((a, b) => {
        const bumpOrder = { major: 0, minor: 1, patch: 2 };
        const aBump = Math.min(
          ...a.packages.map((p) => bumpOrder[p.bump as keyof typeof bumpOrder])
        );
        const bBump = Math.min(
          ...b.packages.map((p) => bumpOrder[p.bump as keyof typeof bumpOrder])
        );
        return aBump - bBump;
      });
  } catch {
    return [];
  }
}
