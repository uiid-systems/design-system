# Docs Rendering Strategy

## Decision: MDX-first

All component documentation pages use MDX as the primary rendering path. The legacy `ComponentDetails` component remains as a fallback but should not be used for new pages.

## Architecture

```
page.tsx (Server Component)
├── compileMDX + rehypeShiki (server-side)
├── highlight() for code examples (server-side)
└── MdxContent (Server Component)
    └── PreviewProvider (Client — useState for active tab)
        ├── ComponentDetailsHeader (Client — reads active tab for playground link)
        └── <article> (MDX output)
            ├── Preview (Client — renders interactive component + pre-rendered code)
            └── PropsTable (Client — Accordion for interactive disclosure)
```

## MDX Page Structure

Every component MDX file follows this pattern:

```mdx
---
component: ComponentName
---

Description of the component.

### Quick tips

- Tip 1
- Tip 2

<Preview />

---

## Props

<PropsTable />
```

### Rules

- **Heading for props:** Always `## Props` (h2). Not `### Properties`, not `## Properties`.
- **Preview component:** Use `<Preview />` — it handles tree-based previews, code examples, and legacy fallback automatically.
- **PropsTable component:** Use `<PropsTable />` — props are injected from registry data by the server component.
- **ComponentLink:** Use `<ComponentLink name="Box" />` to link to other component pages.

## SSR Boundaries

| Component | Runs on | Why |
|-----------|---------|-----|
| `page.tsx` | Server | Compiles MDX, pre-renders code examples with Shiki |
| `MdxContent` | Server | Layout wrapper, no interactivity |
| `ComponentDetailsHeader` | Client | Uses `usePreviewContext()` for dynamic playground link |
| `Preview` | Client | Uses `usePreviewContext()` for active tab, renders interactive components |
| `PropsTable` | Client | Uses `Accordion` (interactive expand/collapse) |
| `CodeBlock` | Client | Copy button requires clipboard API; HTML is pre-rendered server-side via `html` prop |

## Code Example Pre-rendering

Code examples are generated from registry preview trees using `generateCodeExample()` and highlighted with Shiki's `highlight()` in the server component. The pre-rendered HTML is passed to `CodeBlock` via its `html` prop, eliminating client-side Shiki loading and preventing FOUC.

## Adding a New Component Page

1. Create `apps/docs/content/{category}/{component-slug}.mdx`
2. Follow the structure above
3. Ensure the component has a registry entry with `previews` for the `<Preview />` component to work
4. Build to verify: `pnpm run build --filter=docs`
