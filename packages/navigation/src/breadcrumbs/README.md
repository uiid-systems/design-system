# Breadcrumbs

> A trail of links from the site root to the current page. Renders a `<nav>` landmark around an ordered list, with every crumb but the last as a link and the last marked as the current page.

Use Breadcrumbs when you want to:

- Show where the current page sits in a hierarchy, from an array of `{ label, value }` items
- Render each link through a router's component, such as Next.js `Link`, with `linkAs`
- Put an icon before a crumb's label with `icon`
- Compose a trail by hand, such as with a custom separator, from the exported subcomponents

## Quick Reference

```tsx
import { Breadcrumbs } from "@uiid/navigation";

<Breadcrumbs
  items={[
    { label: "Home", value: "/" },
    { label: "Components", value: "/components" },
    { label: "Breadcrumbs", value: "/components/breadcrumbs" },
  ]}
/>

// Router links
<Breadcrumbs items={items} linkAs={Link} />
```

## Props

| Prop     | Type                    | Default | Description                                                         |
| -------- | ----------------------- | ------- | ------------------------------------------------------------------- |
| `items`  | `BreadcrumbsItemData[]` | —       | The trail, root first (required). The last item is the current page |
| `linkAs` | `ComponentType \| "a"`  | `"a"`   | Component each link renders as. It receives `href` and `children`   |

Remaining props, including `Box` layout props and `aria-label`, are spread onto the `<nav>`.

Each `BreadcrumbsItemData` is `{ label: string; value: string; icon?: Icon }`. `value` is the crumb's `href` and its React key, so keep values unique.

## Composition

`BreadcrumbsContainer`, `BreadcrumbsList`, `BreadcrumbsItem` and `BreadcrumbsSeparator` build the same markup by hand. `BreadcrumbsList` is a wrapping `Group` rendered as an `<ol>`, so it takes Group's layout props. A hand-built trail must set `aria-current="page"` on its last item itself; `BreadcrumbsSeparator` renders `/` unless given children.

## Data Slots

| Slot                    | Element                       |
| ----------------------- | ----------------------------- |
| `breadcrumbs`           | Root `<nav>`                  |
| `breadcrumbs-list`      | The `<ol>`                    |
| `breadcrumbs-item`      | Each crumb's `<li>`           |
| `breadcrumbs-separator` | The `<li>` between two crumbs |

## Accessibility

- The root is a `<nav>` landmark labelled "breadcrumbs"; pass `aria-label` to rename it.
- The last crumb is plain text, not a link, and its `<li>` has `aria-current="page"`.
- Separators are `aria-hidden` and `role="presentation"`, so screen readers read only the crumbs.
