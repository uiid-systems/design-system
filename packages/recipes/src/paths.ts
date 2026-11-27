/**
 * Where `recipes:sync` and `recipes:check` read from and write to. Resolved
 * with no trailing slash, so a symlink check on them sees the link itself.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = resolve(here, "../../..");

/** The app shell recipe, the one source of its files. */
export const APP_SHELL_FILES = resolve(here, "../app-shell/files");

/** The docs app, which runs a copy of the app shell. */
export const DOCS_APP = resolve(REPO_ROOT, "apps/docs");
