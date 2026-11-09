import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  // Externalized rather than inlined so `dist` never vendors a build-time copy
  // the consumer cannot dedupe or update. It stays an ordinary dependency
  // (not a peer): it holds no React context shared across packages, so a
  // single resolved instance is not required.
  external: [/^markdown-to-jsx(\/|$)/],
  // No `cssLayer`: Markdown ships no CSS of its own; all styling comes from Prose.
});
