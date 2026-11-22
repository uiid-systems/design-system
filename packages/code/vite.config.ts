import cssLayers from "../../scripts/css-layers.cjs";
import { createViteConfig } from "../../vite.config.ts";

export default createViteConfig({
  external: [/^shiki/, /^@shikijs\//],
  cssLayer: cssLayers.code,
});
