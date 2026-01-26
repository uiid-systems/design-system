import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";

import { toSlug } from "@/constants/urls";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Check if MDX content exists for a component
 */
export function hasMdxContent(category: string, componentName: string): boolean {
  const slug = toSlug(componentName);
  const mdxPath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  return fs.existsSync(mdxPath);
}

/**
 * Get the raw MDX content for a component
 */
export function getMdxSource(category: string, componentName: string): string | null {
  const slug = toSlug(componentName);
  const mdxPath = path.join(CONTENT_DIR, category, `${slug}.mdx`);

  try {
    if (fs.existsSync(mdxPath)) {
      return fs.readFileSync(mdxPath, "utf-8");
    }
  } catch {
    // File doesn't exist or can't be read
  }

  return null;
}

/**
 * Compile MDX content with syntax highlighting
 */
export async function compileMdxContent<TFrontmatter = Record<string, unknown>>(
  source: string,
  components: Record<string, React.ComponentType<Record<string, unknown>>>
) {
  return compileMDX<TFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: "vitesse-light",
                dark: "vitesse-black",
              },
              defaultColor: false,
            },
          ],
        ],
      },
    },
  });
}
