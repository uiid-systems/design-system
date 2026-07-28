import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react"],
  cssLayer: "uiid.components",
});
