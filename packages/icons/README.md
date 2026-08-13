# @uiid/icons

> The full lucide icon set plus uiid additions — the single source of truth for icons across the design system.

Import icons from here, never from `lucide-react` directly. That guarantees one icon library at one version, and keeps ~2,000 icon names out of the `@uiid/design-system` component barrel.

Every lucide icon is available immediately — there is no allowlist and nothing to regenerate before using one.

```tsx
// One icon, one module — the preferred form
import { GlobeIcon } from "@uiid/icons/globe";

// The barrel — reaches every icon, at the cost of parsing the whole set
import { GlobeIcon } from "@uiid/icons";
```

Apps that depend on `@uiid/design-system` rather than on `@uiid/icons` reach the same icons through the facade, which forwards both forms:

```tsx
import { GlobeIcon } from "@uiid/design-system/icons/globe";
import { GlobeIcon } from "@uiid/design-system/icons";
```

## Which import to use where

| Context                                    | Import                                    | Why                                                                                                           |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Packages in this repo, Storybook, docs     | `@uiid/icons/<icon>`                      | Vite has no barrel optimization, so the subpath is how a build stays proportional to the icons actually used. |
| Apps consuming the published design system | `@uiid/design-system/icons/<icon>`        | Same guarantee, reached through the facade — apps depend on `@uiid/design-system`, not on `@uiid/icons`.      |
| Type positions                             | `import type { Icon } from "@uiid/icons"` | A type-only import is erased at compile time, so it costs a consumer's build nothing.                         |

The subpath is lucide's own icon name, as shown on [lucide.dev/icons](https://lucide.dev/icons) — `@uiid/icons/external-link`, `@uiid/icons/arrow-up-right`. It is not always derivable from the export name: `HomeIcon` lives in `house`, `UserCircleIcon` in `circle-user`, `WrapTextIcon` in `text-wrap`.

## Naming

Every icon is exposed only under its **`*Icon`** name (`GlobeIcon`, never `Globe` or `LucideGlobe`). This is lucide's recommended convention, and the bare names collide with words used elsewhere in the system — `Image` shadows the DOM global, `Code` collides with `@uiid/code`, and `Link`, `Filter` and `Timer` are all waiting to.

## What's exported

- **~2,000 lucide icons** — the full set, single-named on the `*Icon` convention.
- **`LoadingSpinnerIcon`** — a uiid spinner for loading states, reachable at `@uiid/icons/loading-spinner` like any other icon.
- **`createLucideIcon`** — author a custom icon in the lucide style.
- **`Icon`, `IconProps`** — the shared icon component and props types.

## Why icons are reached per-module

`lucide-react` ships no `exports` field and no per-icon entry points of its own: its root module is a single large file of ~1,750 `export … from "./icons/<name>.mjs"` lines, plus a namespace re-export of `icons/index.mjs`. Importing anything from that root makes a consumer's bundler pull the whole thing.

**The cost is in the build, not the output.** Tree-shaking works correctly either way — the emitted bundle is byte-identical and correctly tiny — so bundle size never reveals the problem. What it costs is build time, as a silent stall in the middle of a build. In balance, where this same bug was diagnosed first, it was a multi-minute stall that took a Storybook production build from 70s to 6s once fixed.

Measured module graphs for reaching a single icon, and for importing one component from the design system:

| What is imported                                        | Modules parsed | lucide icon modules   | lucide root |
| ------------------------------------------------------- | -------------- | --------------------- | ----------- |
| One icon, through lucide's root (the shape before this) | 1,779          | 1,768                 | **1**       |
| One icon, via `@uiid/design-system/icons/globe`         | **13**         | **1**                 | 0           |
| One icon, via the `@uiid/design-system/icons` barrel    | 1,780          | 1,767                 | 0           |
| `Button` from the `@uiid/design-system` root barrel     | 2,662          | 19 (only what's used) | 0           |

Two things follow. Both barrels produce a comparable module count, so module count is not what hurt — lucide's root module itself is. Everything here therefore goes straight to `lucide-react/dist/esm/icons/<name>.mjs`, and the generated barrel must never import from `"lucide-react"`. And icons stay out of the `@uiid/design-system` root barrel entirely: importing a component now reaches only the icons that component actually uses.

Deep-importing lucide's internals is safe because its `package.json` has no `exports` field, so those paths are legitimately reachable. It ships no `.d.ts` beside them, so `src/lucide-deep-imports.d.ts` declares their types. Both are worth re-checking on a major `lucide-react` bump.

The icon type is declared structurally in `src/icon-type.ts` rather than re-exported from lucide. Packages that consume this one do not depend on `lucide-react`, so a published `.d.ts` naming lucide's types is unresolvable for them (TS2742) the moment they annotate or re-export an icon.

## Updating the icon set

Bump `lucide-react`, then regenerate:

```bash
pnpm --filter @uiid/icons generate
```

`scripts/generate-icon-exports.mjs` rewrites the committed barrel (`src/lucide-icons.generated.ts`). The per-icon subpath modules are emitted into `icons/` by `build`, `dev`, and the repo `postinstall`, and are not committed — they sit outside `dist` on purpose, because `vite build --watch` empties `dist` on every rebuild and would delete them.

Both read their icon list from `scripts/lucide-icon-map.mjs`, which parses `lucide-react`'s own root module for the authoritative export-name → file mapping. It parses rather than derives, because the two do not always correspond, and it throws if it parses implausibly few icons, hits a name lucide doesn't export, or points at a missing file — so a future lucide layout change fails the generate step instead of silently shipping a partial set.

### Guardrails

`src/module-graph.test.ts` bundles fixtures and asserts on the resulting module graph, so this cannot regress silently. It enforces that:

- a subpath import parses exactly one lucide module and never lucide's root;
- the barrel reaches every icon without lucide's root, at a cost equal to the number of distinct icon modules;
- the barrel exposes the full set, single-named on `*Icon`, with nothing gated behind a manual step;
- every barrel export is reachable as a built subpath module, with types, through the package's `exports` map.

`packages/design-system/src/icons.test.ts` guards the facade: that icons stay out of the root barrel, and that both `./icons` and `./icons/*` are declared and forwarded.
