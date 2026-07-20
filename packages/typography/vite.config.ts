import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  cssLayer: "uiid.primitives",
  external: [/^@number-flow\/react/, /^number-flow/],
});
