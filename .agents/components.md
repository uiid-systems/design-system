# Component Conventions

Each component is a directory of `{name}.tsx`, `.types.ts`, `.variants.ts` (when it uses `cva`), `.constants.ts` (when it has constants), `.module.css`, `.test.tsx`, `.examples.tsx`, and `README.md`, plus `.hooks.ts` and `.utils.ts` when it has state or pure helpers. Subcomponents live in a `subcomponents/` directory. Match `packages/typography/src/text/`.

These conventions apply to app components under `apps/*/components/` as well as to packages. A recipe, meaning several components composed into one piece of an app such as a shell with a sidebar and a header, follows the further rules in `.claude/skills/uiid/skills/structure-recipe/SKILL.md`.

Components use kebab-case filenames and PascalCase names. Set `data-slot` on the root element, merge classNames with `cx()` from `@uiid/utils`, spread remaining props to the root, and add `"use client"` for client components.

When the merged `className` goes to a Base UI part, use `cxState()` instead. A Base UI `className` may be a function of the part's state, which `cx` cannot call, so it rejects one at the type level and would drop it at runtime. Given a function, `cxState` returns one that resolves it with the part's state, then merges; given none, it returns the plain string `cx` would. Keep that string case: a function prop cannot cross from a server component into a client one, so a part composed on the server must still receive a string.

Prefer simple monolithic components for common cases, exporting subcomponents for advanced composition. Expose frequently-used props directly rather than forcing them through nested prop objects.

A top-level prop wins over the same key in `RootProps`, and in Collapsible's `PanelProps` for `keepMounted` and `instant`. Spread `RootProps` first and the top-level values after, passing them through `definedProps()` from `@uiid/utils` so an unset or `undefined` one doesn't erase the `RootProps` value; it takes named props (`definedProps({ open, modal })`) and a rest object (`definedProps(props)`) alike. Only the overlays (Dialog, Drawer, Popover, Tooltip) compose a handler, running `RootProps.onOpenChange` and then the top-level `onOpenChange`; every other handler follows top-level-wins. `<Dialog modal={false} RootProps={{ modal: true }} />` is non-modal.

Mirror the Base UI API — never rename a primitive or recast a prop it already ships. Additions must be additive.

## Use UIID utilities, not the upstream libraries

When porting components from shadcn or Radix patterns, substitute:

| External                    | UIID                                                     |
| --------------------------- | -------------------------------------------------------- |
| `@radix-ui/react-slot`      | `renderWithProps` from `@uiid/utils`                     |
| `@radix-ui/react-direction` | `useDirection` from `@base-ui/react/direction-provider`  |
| `class-variance-authority`  | `cva` from `@uiid/utils` (pre-configured)                |
| `clsx` / `tailwind-merge`   | `cx` (or `cxState` on a Base UI part) from `@uiid/utils` |

Use regular elements for domain components. Only use `renderWithProps` for low-level layout primitives (`Box`, `Text`).

## Sharing code between components

Never duplicate. How you share depends on what the shared thing _is_.

**Standalone components may be imported directly**, including from a sibling directory. A component that renders another component is ordinary composition — ToggleButton renders Button, and a composite form control may render Input and Checkbox. Those stay where they live; do not hoist them into a shared directory. The same applies to importing a component's _variant styles_ from its source rather than copying them (Input → Select).

**Fragments get abstracted.** When the shared thing is not a component in its own right — a popup tree, a label row, a control surface — put it in a neutral shared module instead of having one component reach into a sibling for it. See `packages/forms/src/shared/` (the combobox/autocomplete popup layer and input group) and `packages/forms/src/field/subcomponents/field-row.tsx`, shared by checkbox, switch and radio.

The test is whether the thing could stand on its own as a documented component. If yes, import it. If it is only ever a piece of something else, share it neutrally so neither component owns the other.

## Creating a new package

Copy an existing package's config rather than writing it fresh — `packages/interactive` is the plainest exemplar. Then register the package at every point below. Most of these fail silently when skipped: the package still builds, but it is never versioned, layered, or re-exported. `scripts/check-package-registration.mjs` runs in CI and fails on a missing `"@uiid/source"` key from step 1, a step 2 tsconfig or `build` script that skips the shared config or the clean step, a missed step 4, 6, 7 or 9, and on any public package that depends on a private one.

1. `packages/{name}/package.json` — the version matches every other `@uiid/*` package (one shared version). Add `"private": true` while the package is unreleased: `pnpm -r publish` skips private packages, and npm needs a trusted publisher for the name before its first publish. When you remove `"private": true`, run `npm login` and `pnpm npm:bootstrap` to publish a placeholder and link the name to `release.yml`; the Release Preflight check on the release PR fails until you do, and does not re-run on its own, so re-run it afterwards. While it is private, nothing publishable may depend on it (see step 9). Every JS entry in `exports` starts with an `"@uiid/source"` key pointing at that entry's own source file (`./src/index.ts` for `.`). Tests, Storybook and `pnpm typecheck` resolve `@uiid/{name}` to source through that condition, and resolution follows key order, so it must be first
2. `packages/{name}/tsconfig.json`, `vite.config.ts` and the `build` script. The tsconfig is only `{ "extends": "../../tsconfig.package.json" }`, which sets declaration-only emit to `dist`, leaves tests, examples and stories out, and keeps build info out of the tarball. The Vite config uses `createViteConfig({ cssLayer: cssLayers.{name} })`. The script is `node ../../scripts/clean-build-output.mjs && tsc -b && vite build`: neither `tsc` nor Vite empties `dist`, so without the clean step a renamed or deleted file's old output ships
3. `src/index.ts` barrel and `src/vite-env.d.ts` for CSS module types. `"use client"` stays out of the barrel
4. `scripts/css-layers.cjs` — add the package, or its CSS ships unlayered
5. `vitest.config.ts` and `tsconfig.check.json` — nothing to register: the typecheck globs `packages/*/src`
6. `tsconfig.json` (root) — add `{ "path": "./packages/{name}" }` to `references`
7. `release-please-config.json` — add an `extra-files` entry for `packages/{name}/package.json`, or release-please leaves its version behind
8. `.size-limit.js` — nothing to register: size entries are generated from every `packages/*` with a `dist/index.js`. Add a component to `SINGLE_IMPORTS` there only when the cost of importing it alone is worth tracking
9. `packages/design-system/package.json` and `src/index.ts` — add the `workspace:*` dependency and `export * from "@uiid/{name}"`, but only once the package is published. `pnpm -r publish` skips a private package and still publishes the umbrella, which would then depend on a version npm cannot serve. Do this in the same PR that removes `"private": true`
10. `packages/design-system/src/globals.css` — `@import "@uiid/{name}/globals.css"` once the package ships CSS. Tests and Storybook stub these built sheets out, since component CSS modules already load from source. A types-only package emits no stylesheet, so skip this until it does, and add `"./globals.css": "./dist/{name}.css"` to the package's `exports` at the same time
11. `README.md` — add the package to the package list
12. `pnpm install` to link the workspace package

Storybook needs no registration. `apps/storybook/.storybook/main.ts` resolves every `@uiid/*` package to source through the `@uiid/source` condition from step 1, and stories are globbed from `apps/storybook/stories/**`.
