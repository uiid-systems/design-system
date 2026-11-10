# Size Limit

Every PR is measured against its base branch. There are no fixed budgets: the check reports how much each entry changed and fails only when one grows sharply. Results show up as a comment on the PR.

---

## What is measured

`.size-limit.js` generates the entries from `packages/*`, so a new package is measured without registration. Every size is minified and brotlied, and leaves out the peer dependencies of the package it is measured from.

| Entry                | What it is                                                              |
| -------------------- | ----------------------------------------------------------------------- |
| `@uiid/{name}`       | The package's whole barrel, `dist/index.js`, without React or Base UI   |
| `@uiid/{name} (css)` | The package's built stylesheet (its `./globals.css` export), as shipped |
| `import { Button }`  | One component imported from `@uiid/design-system`, without React        |

The package entries leave out Base UI so that a package's own growth is not buried under it: `@uiid/buttons` is about 6 kB of its own code and 40 kB with Base UI and React bundled. The umbrella declares only React as a peer, so the single-import entries keep the Base UI code that import pulls in. That makes them the ones closest to what a consumer pays, and they are how a lost tree-shake shows up: the barrel total stays the same while `import { Stack }` jumps. They are listed by hand in `SINGLE_IMPORTS` in `.size-limit.js`. Keep that list short and representative.

## How the comparison works

The `Size Limit` workflow runs on every non-draft PR, including stacked PRs that target another branch. It:

1. Builds the PR (merged into its base) and runs `size-limit --json`.
2. Checks out the base commit as a second worktree, builds it, and measures it with the PR's config by pointing `SIZE_ROOT` at that worktree. Both builds share one Turbo cache, so the base build is mostly cache hits.
3. Runs `scripts/size-compare.mjs` on the two reports and posts the result as a PR comment.

An entry that exists on only one side is reported as new or removed and never fails the check.

The workflow does not re-run when a PR's base branch is changed without a push. After retargeting a stacked PR, push or re-run the workflow to compare against the new base.

## When the check fails

The check fails when any entry grows by more than **5% and 2 kB**. Growth has to clear both, so a small package can gain a component and a large one is not failed by a small change. Both thresholds are constants at the top of `scripts/size-compare.mjs`.

1. **Unintentional growth** → investigate (new dependency? lost tree-shake? barrel re-export of a heavy library?) and fix.
2. **Intentional growth** → add the `size-increase-ok` label to the PR. The check re-runs and passes, and the comment still records the increase.

## Running it locally

```bash
pnpm run build --filter='./packages/*'
pnpm size
```

`pnpm size` prints the current size of every entry. A package without a built `dist/index.js` is skipped rather than failing the run, so build first.

To compare two checkouts the way CI does:

```bash
pnpm size-limit --json > head.json
SIZE_ROOT=../other-checkout pnpm size-limit --json > base.json
node scripts/size-compare.mjs base.json head.json
```
