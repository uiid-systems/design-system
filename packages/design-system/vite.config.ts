import { createViteConfig } from "../../vite.config";

// `src/icons.ts` is a second entry rather than part of the barrel: icons must be
// reachable as `@uiid/design-system/icons` without importing a component pulling
// the whole icon set into a consumer's module graph. `src/utils.ts` is an entry
// for the same reason: helpers alone should not load the component barrel.
export default createViteConfig({
  entry: ["src/index.ts", "src/icons.ts", "src/utils.ts"],
});
