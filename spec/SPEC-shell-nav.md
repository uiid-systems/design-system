# Spec: shell-nav — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map-app-shell.md`.

## Objective

One nav config is the only place a project names its pages. The sidebar's groups and items and the breadcrumb labels all come from it. The docs app's sitemap becomes that config, so the docs app proves the shape before anything is packaged.

## Current behavior this spec changes

- `sidebar.constants.ts` imports `COMPONENTS_SITEMAP` from `apps/docs/sitemap.ts` and reshapes it into `SIDEBAR_GROUPS`.
- `sidebar.tsx` hard-codes the Home and Changelog items above the groups.
- An item is active only when the pathname equals its href exactly. A nested route highlights nothing.
- `breadcrumbs.utils.ts` builds one crumb per URL segment and title-cases it, and hard-codes `Home`. Page names live in two places, and a segment with no page still gets a link: `/layout` has no page today, so its crumb leads to a 404.
- The sitemap's shape is `{ label, value }` items in `{ category, items }` groups, and its types allow nesting that nothing renders.

## Requirements

1. The config is `nav.ts` at the project root, imported as `@/nav`, exporting `NAV`. It is plain data:

   ```ts
   import type { NavEntry } from "@/lib/nav";

   export const NAV: NavEntry[] = [
     { label: "Home", href: "/" },
     { label: "Changelog", href: "/changelog" },
     {
       label: "Layout",
       items: [
         { label: "Box", href: "/layout/box" },
         { label: "Stack", href: "/layout/stack" },
       ],
     },
   ];
   ```

2. `lib/nav.ts` holds the types (`NavItem`, `NavGroup`, `NavEntry`) and the pure helpers the recipe needs. A group's `items` are `NavItem[]`: one level, enforced by the type. A group may have an `href` when it has a page of its own. It imports nothing but types.
3. The sidebar renders `NAV` in config order. Consecutive top-level items share one list; each group renders as a `SidebarGroup`. Nothing in `sidebar/` names a page.
4. A group's saved-state id is its `label`. Labels are unique among groups; this is documented on the type.
5. An item is active when the pathname equals its href, or starts with its href followed by `/`. When several match, the longest href wins. `"/"` matches only itself. The active item's group is the active group. On a group's own `href` no item is active, and that group is the active group. Matching compares paths only: the query string and hash are ignored on the current URL and stripped from an entry's href before comparing, so `/reports?view=week` is active on `/reports` whatever the query.
6. Everything the sidebar does today keeps working: the active group opens on load and on navigation, saved group state survives a reload with no flash, the active item is marked `aria-current="page"` and is visible in the scroll track.
7. The breadcrumb trail is built from `NAV` alone. Nothing title-cases a URL segment and no label is hard-coded. In order: the item whose href is `"/"`, when the config has one and the current page is not it; the active group, when it has an `href`; the active item. Each crumb's label and link come from its nav entry. A group with no `href` gets no crumb.
8. On a route below a nav item, such as `/settings/profile/edit`, the trail is that item's trail. On a route nothing in `NAV` matches, the trail is the `"/"` item alone, or empty when there is none.
9. `apps/docs/sitemap.ts` is deleted. `apps/docs/nav.ts` replaces it with the same pages in the same order. Its groups have no `href` yet: each gains one in the PR that adds its category page, and its crumb appears then. The docs `Pager` reads `NAV` through a `lib/nav.ts` helper that lists items in order.
10. `SIDEBAR_GROUPS` is removed from `sidebar.constants.ts`. The parts in `sidebar/subcomponents/` keep their props; only the composed `Sidebar` reads `@/nav`.
11. `.claude/rules/recipes.md` gains a short section: where the nav config lives, that `lib/` holds a recipe's non-component code, and the import rule from the map's code style section.

## Testing strategy

- `apps/docs/lib/nav.test.ts` covers the helpers: active matching (exact, nested, longest match, the `"/"` case, an href with a query or hash, no match), ordered item listing, and the trail (an item at the top level, an item in a group with and without an `href`, a group's own page, a route below an item, no match, a config with no `"/"` item). The root Vitest config does not include `apps/`; add the docs `lib/` to it, or state in the PR why the tests live elsewhere.
- A headless Playwright script against the docs app, attached to the PR: every page in `NAV` appears once in the sidebar; a nested URL highlights its parent item; breadcrumb labels match the config; the pager order is unchanged from `main`.

## Success criteria

- [ ] `git grep -n "sitemap" apps/docs` returns nothing.
- [ ] `git grep -n -E "Home|Changelog" apps/docs/components/{sidebar,breadcrumbs}` returns nothing, and `breadcrumbs.utils.ts` has no function that turns a URL segment into a label.
- [ ] On `/layout/box` the trail reads Home, Box. Giving the Layout group an `href` in `nav.ts`, and nothing else, makes it read Home, Layout, Box.
- [ ] Adding one item to `apps/docs/nav.ts` and nothing else makes it appear in the sidebar and gives its page the right breadcrumb label.
- [ ] The docs sidebar and pager list the same pages in the same order as on `main`.
- [ ] `pnpm typecheck`, `pnpm run lint` and `pnpm run build --filter=docs` pass.

## Out of scope (deferred)

- Icons, badges, descriptions, external links or permissions on a nav entry.
- Nested groups.
- Generating the config from the file system, or routes from the config.
- Linking a group's label in the sidebar to its page. A group's `href` feeds the breadcrumb only; the sidebar label stays a toggle.
- The docs app's category pages.
- A page adding a crumb for itself, which a page with a dynamic name needs. The config cannot know those names.
- Telling apart two entries that differ only by query string. Both are active on their shared path. Matching on the query would need `useSearchParams` in the sidebar, which costs every project a Suspense boundary.

## Open questions

None.
