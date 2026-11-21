import cssLayers from "../../scripts/css-layers.cjs";
import { createViteConfig } from "../../vite.config.ts";

export default createViteConfig({
  preserveDirectives: false,
  cssLayer: cssLayers.layout,
});
