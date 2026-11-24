import { createViteConfig } from "@uiid/config/vite";

export default createViteConfig({
  preserveDirectives: false,
  external: ["cva"],
});
