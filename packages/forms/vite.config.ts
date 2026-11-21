import cssLayers from "../../scripts/css-layers.cjs";
import { createViteConfig } from "../../vite.config.ts";

export default createViteConfig({
  cssLayer: cssLayers.forms,
});
