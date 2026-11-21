// Types for emit-per-icon-modules.mjs, so icon-type.test.ts can import it under
// `pnpm typecheck` (TS7016 without them). Only what TypeScript imports is
// declared: nothing checks this file against the script, so an unused
// declaration could go stale unnoticed.

/** The `Icon` declaration the per-icon subpath modules use. */
export declare const ICON_TYPE_DTS: string;
