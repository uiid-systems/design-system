import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["@base-ui/react", "embla-carousel-react"],
  cssLayer: "uiid.components",
});
