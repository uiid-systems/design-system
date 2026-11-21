import { createViteConfig } from "../../vite.config.ts";

export default createViteConfig({
  preserveDirectives: false,
  external: ["cva"],
});
