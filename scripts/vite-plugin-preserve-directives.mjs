import { readFileSync } from "fs";

/**
 * Vite plugin to preserve "use client" and "use server" directives in the built output.
 * These directives are required for Next.js App Router to properly handle client/server boundaries.
 *
 * @returns {import('vite').Plugin} Vite plugin
 */
export function preserveDirectives() {
  return {
    name: "preserve-directives",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk" && chunk.code && chunk.moduleIds) {
          // Check all source modules in this chunk for directives
          for (const moduleId of chunk.moduleIds) {
            if (
              moduleId &&
              !moduleId.includes("node_modules") &&
              (moduleId.includes(".tsx") || moduleId.includes(".ts"))
            ) {
              try {
                const source = readFileSync(moduleId, "utf-8");
                const directiveMatch = source.match(
                  /^["']use (client|server)["'];?\s*/,
                );

                if (directiveMatch) {
                  const directive =
                    directiveMatch[1] === "client"
                      ? "use client"
                      : "use server";
                  if (!chunk.code.startsWith(`"${directive}"`)) {
                    chunk.code = `"${directive}";\n${chunk.code}`;
                  }
                  break; // Found directive, stop checking
                }
              } catch (e) {
                // Ignore read errors
              }
            }
          }
        }
      }
    },
  };
}
