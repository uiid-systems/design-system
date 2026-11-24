import cssLayers from "@uiid/config/scripts/css-layers.cjs";
import { createViteConfig } from "@uiid/config/vite";

export default createViteConfig({
  preserveDirectives: false,
  cssLayer: cssLayers.layout,
});
