import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: [/^shiki/, /^@shikijs\//],
});
