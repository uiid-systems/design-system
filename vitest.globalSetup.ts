import { emitGeneratedSources } from "./scripts/emit-generated-sources.ts";

// Generates the token CSS and @uiid/icons' per-icon modules before any test file
// loads, so `pnpm test:run` needs no build. It runs once per process here, since
// the root config has no `projects`, and Vitest does not rerun it on watch reruns.
export default function setup() {
  emitGeneratedSources();
}
