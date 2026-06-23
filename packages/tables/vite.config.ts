import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react"],
  preserveDirectives: true,
  cssLayer: "uiid.components",
});
