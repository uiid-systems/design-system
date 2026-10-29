# Component Conventions

Each component is a directory of `{name}.tsx`, `.types.ts`, `.variants.ts` (when it uses `cva`), `.constants.ts`, `.module.css`, `.test.tsx`, `.examples.tsx`, and `README.md`. Subcomponents live in a `subcomponents/` directory. Match `packages/typography/src/text/`.

Components use kebab-case filenames and PascalCase names. Set `data-slot` on the root element, merge classNames with `cx()` from `@uiid/utils`, spread remaining props to the root, and add `"use client"` for client components.

When the merged `className` goes to a Base UI part, use `cxState()` instead. A Base UI `className` may be a function of the part's state, which `cx` cannot call, so it rejects one at the type level and would drop it at runtime. Given a function, `cxState` returns one that resolves it with the part's state, then merges; given none, it returns the plain string `cx` would. Keep that string case: a function prop cannot cross from a server component into a client one, so a part composed on the server must still receive a string.

Prefer simple monolithic components for common cases, exporting subcomponents for advanced composition. Expose frequently-used props directly rather than forcing them through nested prop objects.

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

**Standalone components may be imported directly**, including from a sibling directory. A component that renders another component is ordinary composition — Badge renders Status, and a composite form control may render Input and Checkbox. Those stay where they live; do not hoist them into a shared directory. The same applies to importing a component's _variant styles_ from its source rather than copying them (Input → Select).

**Fragments get abstracted.** When the shared thing is not a component in its own right — a popup tree, a label row, a control surface — put it in a neutral shared module instead of having one component reach into a sibling for it. See `packages/forms/src/shared/` (the combobox/autocomplete popup layer and input group) and `packages/forms/src/field/subcomponents/field-row.tsx`, shared by checkbox, switch and radio.

The test is whether the thing could stand on its own as a documented component. If yes, import it. If it is only ever a piece of something else, share it neutrally so neither component owns the other.

## Creating a new package

Copy an existing package's config rather than writing it fresh — `packages/interactive` is the plainest exemplar. Then register the package at every point below. Most of these fail silently when skipped: the package still builds, but it is never tested, versioned, measured, or re-exported.

1. `packages/{name}/package.json` — the version matches every other `@uiid/*` package (one shared version). Add `"private": true` while the package is unreleased: `pnpm -r publish` skips private packages, and npm needs a trusted publisher for the name before its first publish (see `.github/workflows/release.yml`)
2. `packages/{name}/tsconfig.json` and `vite.config.ts`, using `createViteConfig({ cssLayer: cssLayers.{name} })`
3. `src/index.ts` barrel and `src/vite-env.d.ts` for CSS module types. `"use client"` stays out of the barrel
4. `scripts/css-layers.cjs` — add the package, or its CSS ships unlayered
5. `vitest.config.ts` — add the package to `uiidPackages`, or `@uiid/{name}` does not resolve from source and its tests never run
6. `tsconfig.json` (root) — add `{ "path": "./packages/{name}" }` to `references`
7. `release-please-config.json` — add an `extra-files` entry for `packages/{name}/package.json`, or release-please leaves its version behind
8. `.size-limit.json` — add an entry for `packages/{name}/dist/index.js`
9. `packages/design-system/package.json` and `src/index.ts` — add the `workspace:*` dependency and `export * from "@uiid/{name}"`
10. `packages/design-system/src/globals.css` — `@import "@uiid/{name}/globals.css"` once the package ships CSS. This is also how component CSS reaches Storybook, whose preview imports only tokens. A types-only package emits no stylesheet, so skip this until it does
11. `README.md` — add the package to the package list
12. `pnpm install` to link the workspace package

Storybook needs no registration. `apps/storybook/.storybook/main.ts` aliases every `packages/*/package.json` named `@uiid/*` with a `src/index.ts` to source, and stories are globbed from `apps/storybook/stories/**`.
