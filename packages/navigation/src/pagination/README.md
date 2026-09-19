# Pagination

> Page controls with a "Page X of Y" label and First / Previous / Next / Last buttons that disable themselves at the edges.

## Quick Reference

```tsx
import { Pagination } from "@uiid/navigation";

// Uncontrolled — starts on page 1
<Pagination totalPages={31} />

// Start on a later page
<Pagination totalPages={31} defaultPage={5} />

// Controlled
<Pagination totalPages={31} page={page} onPageChange={setPage} />
```

## Props

| Prop           | Type                     | Default | Description                                                                |
| -------------- | ------------------------ | ------- | -------------------------------------------------------------------------- |
| `totalPages`   | `number`                 | —       | Total number of pages (required). Values below 1 are treated as 1          |
| `page`         | `number`                 | —       | Controlled current page, 1-indexed. Out-of-range values are clamped        |
| `defaultPage`  | `number`                 | `1`     | Initial page when uncontrolled                                             |
| `onPageChange` | `(page: number) => void` | —       | Called with the target page when a control is activated, never the current |

Remaining props, including `Group` layout props and `aria-label`, are spread onto the root.

## Behavior

- `page` and `defaultPage` are clamped to `[1, totalPages]`, so `page={99}` on 10 pages shows page 10.
- `totalPages` of 0 shows "Page 1 of 1" with every control disabled.
- First and Previous disable on page 1; Next and Last disable on the last page.
- Controlled: clicks only call `onPageChange`; the label follows the `page` prop.

## Data Slots

| Slot               | Element                           |
| ------------------ | --------------------------------- |
| `pagination`       | Root `<nav>`                      |
| `pagination-label` | "Page X of Y" live region         |
| `button`           | Each First/Prev/Next/Last control |

## Accessibility

- The root is a `<nav>` landmark labelled "Pagination"; pass `aria-label` to rename it when a page has more than one.
- The "Page X of Y" label is `aria-live="polite"`, so page changes are announced.
- Each icon control has an accessible name ("First page", "Previous page", "Next page", "Last page") and a matching tooltip.
