import cssLayers from "@uiid/config/scripts/css-layers.cjs";
import { createViteConfig } from "@uiid/config/vite";

export default createViteConfig({
  cssLayer: cssLayers.forms,
  // A dependency, so the consumer's bundler resolves and tree-shakes it.
  external: [/^@maskito\//],
});
