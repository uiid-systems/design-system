import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

/*
 * Tokens are mostly generated CSS, but the palette ships as a tiny ES module
 * alongside it so consumers can read the hue set at build time. It is compiled
 * rather than exported as source: @uiid/tokens is published, and a raw `.ts`
 * entry point (with a JSON import) is not something an installing consumer can
 * be expected to transpile.
 *
 * This does not use the shared `createViteConfig` factory — that one is for the
 * React component packages and pulls in the SWC plugin and the "use client"
 * directive handling, neither of which applies here.
 */
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
      // A subset of `createViteConfig`'s exclusions: tokens has tests but no
      // examples or stories. Setting `exclude` replaces the tsconfig's, so its
      // entries are repeated.
      exclude: ["node_modules/**", "dist/**", "**/*.test.*"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      /* Without this, lib mode names the bundle after the package ("tokens.js")
         and the "." export would not resolve. */
      fileName: "index",
    },
  },
});
