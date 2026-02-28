import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react", "vaul"],
  cssLayer: "uiid.components",
});
