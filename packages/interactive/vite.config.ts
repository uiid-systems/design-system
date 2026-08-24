import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  // Externalized rather than inlined so `dist` never vendors a build-time copy
  // the consumer cannot dedupe or update. These stay ordinary `dependencies`
  // (not peers) — unlike `@base-ui/react`, nothing here holds React context
  // shared across packages, so a single resolved instance is not required.
  external: [
    /^@base-ui\/react/,
    /^@dnd-kit\//,
    /^react-resizable-panels(\/|$)/,
  ],
  cssLayer: "uiid.components",
});
