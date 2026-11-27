# Spec: shell-boundary — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after `shell-nav`.

## Objective

Every file in the five recipe directories could be copied into another Next.js app and work unchanged. Whatever belongs to the docs app moves out or is passed in, the layout wiring shrinks to what a project can read at a glance, and the docs app stops loading Tailwind.

## Current behavior this spec changes

- `header/` holds the docs app's GitHub, npm and Storybook links (`header.constants.ts`, `header-links.tsx`) and depends on `@icons-pack/react-simple-icons`.
- `app/layout.tsx` imports `noFlashScript` and three sidebar constants and builds the inline `<script>` itself.
- `apps/docs/app/globals.css` imports Tailwind, `postcss.config.mjs` runs its plugin, and `layout.tsx` must import `globals.css` first so Tailwind's reset stays below the `uiid` layers. No file in the docs app uses a Tailwind class or directive.
- Comments in recipe files describe the docs app ("The docs sidebar", "The docs header").

## Requirements

1. `Header` takes `children` and renders them at its trailing end. With no children it renders the toggle and breadcrumbs only.
2. `HeaderLinks` and the three URLs move to `apps/docs/components/docs/`. The docs layout passes `<HeaderLinks />` to `Header`. `HeaderGroup` stays in `header/` as an exported part.
3. The sidebar exports a part that renders the no-flash script with its own keys, so a layout writes one element in `<head>` and imports no sidebar constant. `noFlashScript` and the constants stay exported for a caller composing its own.
4. Recipe directories import only what the map's code style section allows. `@icons-pack/react-simple-icons` and anything under `@/components/docs` are not on that list.
5. Comments and JSDoc in recipe files describe the component, not the docs app.
6. The localStorage keys and the `data-sidebar` attribute keep their current values. A returning reader's saved state is not lost.
7. Tailwind leaves the docs app: `globals.css` imports only `@uiid/design-system/globals.css`; `postcss.config.mjs` is deleted; `tailwindcss` and `@tailwindcss/postcss` leave `apps/docs/package.json`; the import-order comment leaves `layout.tsx`.
8. If removing Tailwind's reset changes how a docs page looks, the fix goes in the docs app's own CSS or, when it is a gap in the library's globals, in the package that owns it. Tailwind does not come back.
9. `.claude/rules/styling.md` and `.claude/rules/recipes.md` no longer describe Tailwind as available in apps.

## Testing strategy

- Before and after pixel comparison of the docs app for requirement 7: the home page, the changelog, and one page per sitemap category, at one desktop viewport, taken with headless Playwright. The PR lists every page that differs and what was done about it.
- A headless Playwright script, attached to the PR: the sidebar closed and one group closed both survive a reload with no frame showing them open.
- `pnpm run build --filter=docs` proves the pure-mode CSS build without the PostCSS plugin.

## Success criteria

- [ ] `git grep -n -i "tailwind" apps/docs .claude/rules` returns nothing.
- [ ] `git grep -n -E "from \"" apps/docs/components/{shell,sidebar,header,main,breadcrumbs} apps/docs/lib` shows only the allowed imports.
- [ ] `apps/docs/app/layout.tsx` imports no constant from `@/components/sidebar`.
- [ ] `git grep -n -i "docs" apps/docs/components/{shell,sidebar,header,main,breadcrumbs}` returns nothing.
- [ ] The pixel comparison shows no unexplained difference.
- [ ] `pnpm typecheck`, `pnpm run lint` and `pnpm run build --filter=docs` pass.

## Out of scope (deferred)

- Making the design system safe to load beside Tailwind in any import order.
- Renaming the storage keys or making them configurable.
- Replacing jotai, or making the state library a choice.
- Changing how the shell looks.

## Open questions

None.
