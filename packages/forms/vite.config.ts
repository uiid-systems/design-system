import cssLayers from "../../scripts/css-layers.cjs";
import { createViteConfig } from "../../vite.config.ts";

export default createViteConfig({
  cssLayer: cssLayers.forms,
  // A dependency, so the consumer's bundler resolves and tree-shakes it.
  external: [/^@maskito\//],
});
