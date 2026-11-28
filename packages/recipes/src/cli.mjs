#!/usr/bin/env node
// The `uiid-recipes` bin. The logic is in cli.ts, add.ts and create.ts, which
// Node runs by stripping their types; that needs Node 22.18+ or 23.6+, where
// type stripping is on by default. Node does not strip types under
// node_modules, so this runs from a checkout of the repo, not from an
// installed package.
import { spawnRunner } from "./add.ts";
import { runCli } from "./cli.ts";
import { RECIPES_ROOT, REPO_ROOT } from "./paths.ts";

process.exitCode = runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  recipesRoot: RECIPES_ROOT,
  repoRoot: REPO_ROOT,
  run: spawnRunner,
  log: (line) => console.log(line),
  error: (line) => console.error(line),
});
