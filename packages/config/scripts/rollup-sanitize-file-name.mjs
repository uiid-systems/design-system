// Rollup sanitizes every module id before using it as a `[name]` substitution,
// and its INVALID_CHAR_REGEX rewrites `+` to `_`. The two values it then
// compares that id against — `preserveModulesRoot` and the internal
// `inputBase` — are never sanitized. In a checkout whose path contains `+`
// neither comparison matches, so rollup emits a relative path and rejects it:
//
//   Invalid substitution "../../../../foo_bar/packages/icons/src/index"
//   for placeholder "[name]" in "output.entryFileNames" pattern
//
// That breaks every worktree created from a slashed branch name, since git
// writes `feat/thing` to disk as `feat+thing`.
//
// Keeping `+` intact puts the id back in the same form as both comparands.
// Sanitizing the root alone is not enough: it fixes ids under `src/`, but not
// the bundled dependency modules matched against `inputBase` instead.
//
// Trade-off: emitted dependency paths keep pnpm's `+` (`@base-ui+react@1.2.0`
// rather than `@base-ui_react@1.2.0`). That makes output identical whether or
// not the build path contains `+`, where today it silently differs.
//
// See https://github.com/uiid-systems/design-system/issues/289

/** Rollup's own character class, minus `+`. */
// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$%&*,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

/**
 * Drop-in replacement for rollup's default `output.sanitizeFileName` that
 * leaves `+` alone.
 *
 * @param {string} name
 * @returns {string}
 */
export function sanitizeFileName(name) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  // A `:` is only allowed as part of a windows drive letter (ex: C:\foo).
  return (
    driveLetter +
    name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_")
  );
}
