import { emitGeneratedSources } from "./scripts/emit-generated-sources.ts";

// Generates the token CSS and @uiid/icons' per-icon modules before any test file
// loads, so `pnpm test:run` needs no build. Global setup runs once per Vitest
// process, not per project or per watch rerun.
export default function setup() {
  emitGeneratedSources();
}
