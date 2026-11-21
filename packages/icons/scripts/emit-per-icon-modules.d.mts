// Types for emit-per-icon-modules.mjs, so icon-type.test.ts can import it under
// `pnpm typecheck` (TS7016 without them). Only the exports are declared.

/** The `Icon` declaration the per-icon subpath modules use. */
export declare const ICON_TYPE_DTS: string;

/** Writes icons/: one module per icon, plus the `Icon` declaration. */
export declare function emitPerIconModules(options?: { clean?: boolean }): {
  iconCount: number;
  moduleCount: number;
  outDir: string;
};
