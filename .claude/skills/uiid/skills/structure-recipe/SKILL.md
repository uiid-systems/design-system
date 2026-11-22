---
name: structure-recipe
description: File layout for multi-component recipes in apps/*/components/.
---

# UIID structure recipe

A recipe is a set of components that work together: a shell with a sidebar, a header and a main area, for example. It lives in an app, not in a package, and it is built exactly the way package components are built. An app is not a place for looser rules.

Read `.agents/components.md` and `.agents/styling.md` first. They hold the shared rules (file names, `data-slot`, `cx`, spreading props, the inline-style ban) and this skill does not repeat them. What follows is what those chapters leave open once more than one component is involved.

The working exemplar is the docs shell: `apps/docs/components/shell/`, `sidebar/`, `header/`, `main/` and `breadcrumbs/`, composed in `apps/docs/app/layout.tsx`. Read it before writing a new recipe.

## One directory per component

Every component is a directory under `apps/{app}/components/`, never a loose `.tsx` file, however small it is today.

```
sidebar/
  index.ts               barrel: no "use client", no hooks
  sidebar.tsx            the composed component
  sidebar.types.ts       every part's props
  sidebar.constants.ts   when it has constants
  sidebar.hooks.ts       when it has state
  sidebar.utils.ts       when it has pure helpers
  sidebar.module.css     when a style prop can't cover it
  subcomponents/
    index.ts
    sidebar-root.tsx     one part per file
    sidebar-item.tsx
```

- Create a file only when there is something to put in it. A component with no parts has no `subcomponents/`.
- `.test.tsx`, `.examples.tsx` and `README.md` are required in `packages/`. In an app, add them only if the app has a test runner or renders examples. Say which ones were skipped and why when reporting the work.
- Files are kebab-case and prefixed with the component's name. Parts are PascalCase with the same prefix: `SidebarItem` in `sidebar-item.tsx`, with `data-slot="sidebar-item"`.

## The composed component and its parts

- The file named for the directory exports the composed component (`Sidebar`), which is what most callers use.
- Its outermost element is a part called `{Name}Root` in `{name}-root.tsx`. The root carries `data-slot="{name}"`.
- Every part is exported, so a caller can compose a different arrangement. Hooks, utils and internals are not exported from the barrel unless something outside the directory needs them.
- Each part sets `data-slot` and `displayName`, merges `className` with `cx`, and spreads its remaining props onto its root.
- A part that wraps a UIID component which already writes the `data-slot` you want does not write it again.

## When a part becomes its own component

Give something its own top-level directory, rather than a file in another component's `subcomponents/`, when any of these is true:

- It has parts of its own, or will. A sidebar has groups, items and a toggle, so it is a component, not a part of the shell.
- It owns state.
- It could be used without its current parent.
- It is expected to grow. A simple route-driven breadcrumb trail still gets `breadcrumbs/`.

If you are unsure, make it a component. Splitting later costs more than a small directory now.

## Every file belongs where it is

This is the check that catches most structural mistakes. For each file, ask what it is responsible for and whether the directory it sits in is responsible for the same thing.

- **Layout components take what they show.** A shell arranges a sidebar, a header and a page. It receives them as props or children and imports none of them. If a layout component imports its contents, or takes a prop only to pass it to one of them, the contents are in the wrong place.
- **Content lives with the content.** Links to a repository, a sitemap, product copy and their constants belong to the component that shows them, not to the layout around it. `ShellLinks` holding GitHub and npm URLs is the mistake this rule exists for; they belong to the header.
- **Name a directory for what the thing is.** If the best name for a file is `{parent}-{something unrelated to parent}`, it is in the wrong directory.
- **Imports between components run one way.** Draw the arrows before writing the code. A content component may import a layout primitive (a header renders through the shell's bar so the two line up); the layout never imports back. If two components need each other, one of them is holding something that belongs to the other, or to a third.
- **The app's layout or page does the composing.** That is where the shell, sidebar, header and main meet.

When a layout must style something it does not own, such as sliding a sidebar it was handed, it addresses that component by its `data-slot` from its own CSS module, and a comment in the module names the slots it depends on.

## State

- State lives in `{name}.hooks.ts`, and that is the only file that imports the state library. Parts take plain props.
- App-wide state uses a global store (jotai or zustand), not React context.
- The component that owns a piece of state also owns its storage keys, its attributes and any script that restores it before paint.
- Put `"use client"` only on the files that need it, and never on a barrel. Keep the composed component a server component when its parts allow it.

## Styling

Follow `.agents/styling.md`. Two points come up in every recipe:

- Layout comes from UIID components and style props. A CSS module is for what no prop covers: scroll tracks, sticky positioning, transforms, hover states. No Tailwind utility classes.
- App CSS modules compile in pure mode, so every selector needs a local class. Write `:where(.local)[data-state]` or `.local [data-slot="x"]`, never a bare attribute selector.

## Before calling it done

1. List the directory tree and read it as a stranger would. Does each name say what the thing is?
2. For every file, confirm it belongs to its directory by the rules above.
3. List the imports that cross component directories and confirm none form a cycle.
4. Confirm no loose component files remain beside the directories.
5. Run `pnpm run lint`, `pnpm typecheck` and the app's production build. A recipe that renders in dev can still fail the pure-mode CSS build.
6. Report the tree, any convention you chose not to follow, and anything you were unsure about. If a placement was a judgment call, raise it rather than deciding silently.
