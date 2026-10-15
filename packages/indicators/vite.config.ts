import cssLayers from "../../scripts/css-layers.cjs";
import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  cssLayer: cssLayers.indicators,
});
