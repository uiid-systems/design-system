# Size Limit

Every PR runs a per-package bundle-size check. Only packages whose source (or whose dependencies' source) changed vs `main` are built and measured — the rest are skipped. Results show up as a comment on the PR.

---

## Triggers

The `Size Limit` workflow runs on every non-draft PR to `main` (open, reopen, push).

It does **not** run on `main` itself — gating is enforced at PR time.

## How affected packages are detected

The workflow uses pnpm's `[origin/main]` filter, which expands to "packages whose own source changed, plus packages that depend on those." That means:

- Editing `packages/buttons/src/index.ts` → checks `@uiid/buttons` and `@uiid/design-system` (since the umbrella re-exports it).
- Editing `packages/utils/src/index.ts` → checks `@uiid/utils` and everything that depends on it.
- Editing `apps/storybook/...` → checks nothing in `packages/`.

If no `packages/*` changes are detected, the workflow exits cleanly with no comment.

## Configuring limits

All limits live in `.size-limit.json` at the repo root. Each entry maps a workspace package name to a measured `dist/index.js` and a hard limit:

```json
{
  "name": "@uiid/buttons",
  "path": "packages/buttons/dist/index.js",
  "limit": "60 kB"
}
```

The `limit` value is the **brotlied, minified, dependency-inlined** size — the same number a real consumer would pay.

### Tightening or relaxing a limit

Run locally to see the current measured size for any package:

```bash
pnpm build
pnpm size-limit
```

Then edit `.size-limit.json` and adjust `limit:`. Conventions:

- **Tightening** (`90 kB` → `75 kB`): always OK, do it whenever the actual size drops meaningfully.
- **Relaxing**: justify in the PR description. The limit is a contract — raising it means consumers will pay for the new bytes.

## When the gate fails

The PR comment will show which package(s) exceeded their limit. From there:

1. **Unintentional bloat** → investigate (new dep? lost tree-shake? barrel re-export of a heavy lib?) and fix.
2. **Intentional growth** → tighten the change to the smallest reasonable surface, then bump the limit in the same PR with a one-line rationale.
3. **Wrong limit** → if the existing limit was set too tightly during initial calibration, bump it. Note it as calibration, not bloat.

Running `pnpm size-limit --why` locally produces a webpack-style bundle analyzer report — useful for figuring out what's pulling weight.

## Packages not gated

Two packages are intentionally excluded:

| Package        | Reason                                                       |
| -------------- | ------------------------------------------------------------ |
| `@uiid/tokens` | Source-only — ships CSS and TS schema, no `dist/` JS bundle. |
| `@uiid/themes` | Source-only — ships `src/` directly via subpath exports.     |

Tokens and themes still contribute to consumer bundle size; their impact shows up indirectly inside whichever consumer package imports them.
