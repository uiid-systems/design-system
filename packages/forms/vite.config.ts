import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: [/^@base-ui-components\//],
  cssLayer: "uiid.components",
});
