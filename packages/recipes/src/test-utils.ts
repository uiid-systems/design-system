/**
 * Temporary directories and tree snapshots for the command tests. Each test
 * file calls `removeTempDirs` in its `afterAll`.
 */
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const dirs: string[] = [];

/** A new directory under the OS temp directory, by its real path. */
export const tempDir = () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "uiid-recipes-")));
  dirs.push(dir);
  return dir;
};

/** Removes every directory `tempDir` made, trying each even when one throws. */
export const removeTempDirs = () => {
  const failed: unknown[] = [];
  for (const dir of dirs.splice(0)) {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      failed.push(error);
    }
  }
  if (failed.length > 0) throw failed[0];
};

/** Writes each file under `root`, creating its directories. */
export const write = (root: string, files: Record<string, string>) => {
  for (const [name, source] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), source);
  }
};

/** Every entry under `root`, dotfiles and symlinks included, with its contents. */
export const snapshot = (root: string) => {
  const entries: Record<string, string> = {};
  const walk = (rel: string) => {
    for (const name of readdirSync(join(root, rel)).sort()) {
      const path = rel ? `${rel}/${name}` : name;
      const stat = lstatSync(join(root, path));
      if (stat.isSymbolicLink()) {
        entries[path] = `link:${readlinkSync(join(root, path))}`;
      } else if (stat.isDirectory()) {
        entries[path] = "dir";
        walk(path);
      } else {
        entries[path] = readFileSync(join(root, path)).toString("base64");
      }
    }
  };
  walk("");
  return entries;
};

/** `entries` with each file in `files` added, with its directories, sorted as a snapshot is. */
export const withFiles = (
  entries: Record<string, string>,
  files: Record<string, string | Buffer>,
) => {
  const after = { ...entries };
  for (const [name, source] of Object.entries(files)) {
    const segments = name.split("/");
    for (let k = 1; k < segments.length; k++) {
      after[segments.slice(0, k).join("/")] = "dir";
    }
    after[name] = Buffer.from(source).toString("base64");
  }
  return Object.fromEntries(Object.entries(after).sort());
};
