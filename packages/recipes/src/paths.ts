/** Where `recipes:sync` and `recipes:check` read from and write to. */
import { fileURLToPath } from "node:url";

const at = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export const REPO_ROOT = at("../../../");

/** The app shell recipe, the one source of its files. */
export const APP_SHELL_FILES = at("../app-shell/files/");

/** The docs app, which runs a copy of the app shell. */
export const DOCS_APP = at("../../../apps/docs/");
