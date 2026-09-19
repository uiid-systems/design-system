# Pagination

> Page controls with a "Page X of Y" label and First / Previous / Next / Last buttons that disable themselves at the edges. Set `spread` for a numbered page window instead, and `renderLink` to make the controls real links.

## Quick Reference

```tsx
import { Pagination } from "@uiid/navigation";

// Uncontrolled — starts on page 1
<Pagination totalPages={31} />

// Start on a later page
<Pagination totalPages={31} defaultPage={5} />

// Controlled
<Pagination totalPages={31} page={page} onPageChange={setPage} />

// Numbered window — ‹ 1 … 5 [6] 7 … 31 ›
<Pagination totalPages={31} defaultPage={6} spread={1} />

// Links — for URL-driven pages
<Pagination totalPages={31} page={page} renderLink={(target) => <Link href={`?page=${target}`} />} />
```

## Props

| Prop           | Type                             | Default | Description                                                                                  |
| -------------- | -------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `totalPages`   | `number`                         | —       | Total number of pages (required). Values below 1 are treated as 1                            |
| `page`         | `number`                         | —       | Controlled current page, 1-indexed. Out-of-range values are clamped                          |
| `defaultPage`  | `number`                         | `1`     | Initial page when uncontrolled                                                               |
| `onPageChange` | `(page: number) => void`         | —       | Called with the target page when a control is activated, never the current                   |
| `spread`       | `number`                         | —       | Pages shown on each side of the current page. Setting it switches to the numbered layout     |
| `renderLink`   | `(page: number) => ReactElement` | —       | Renders each enabled control as the returned element, a link to `page`. It must carry `href` |

Remaining props, including `Group` layout props and `aria-label`, are spread onto the root.

## Layouts

**Compact** (default): a "Page X of Y" label, then First / Previous / Next / Last icon buttons.

**Numbered** (`spread` set): Previous, a window of page numbers, then Next. There's no label and no First / Last, because the first and last pages are always in the window. Around them sit `spread` pages on each side of the current one. A gap of two or more pages collapses to an ellipsis, and a gap of exactly one shows that page instead, since an ellipsis would take the same space.

| `spread` | Page 6 of 31           | Page 4 of 31         |
| -------- | ---------------------- | -------------------- |
| `0`      | `1 … [6] … 31`         | `1 … [4] … 31`       |
| `1`      | `1 … 5 [6] 7 … 31`     | `1 2 3 [4] 5 … 31`   |
| `2`      | `1 … 4 5 [6] 7 8 … 31` | `1 2 3 [4] 5 6 … 31` |

Page numbers keep a square minimum and grow for longer numbers, so page 100 doesn't clip.

## Links

URL-driven pages want real links, so middle-click, open in new tab, and router prefetch work. `renderLink` is called with each enabled control's target page and returns the element to render it as. Drive `page` from the URL and there's no state to keep in sync:

```tsx
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const page = Number(useSearchParams().get("page") ?? 1);

<Pagination
  totalPages={31}
  page={page}
  spread={1}
  renderLink={(target) => <Link href={`?page=${target}`} />}
/>;
```

- The element **must** carry an `href`. Button renders an `href`-bearing `render` as a real link; without one it falls back to a `role="button"` element.
- Disabled controls skip `renderLink` and stay disabled buttons, so there's never a link to an out-of-range page.
- In the numbered layout every page number links too, and the current one keeps `aria-current="page"`.
- The element's own handlers still fire. Its `onClick` runs first, then the page change and `onPageChange`.
- A click that opens the link elsewhere — Cmd, Ctrl, Shift, or Alt held, or a `target` other than `_self` — runs the element's `onClick` but skips the page change, so this tab stays on its page.

## Behavior

- `page` and `defaultPage` are clamped to `[1, totalPages]`, so `page={99}` on 10 pages shows page 10.
- `totalPages` of 0 shows "Page 1 of 1" with every control disabled.
- First and Previous disable on page 1; Next and Last disable on the last page.
- Clicking the current page number does nothing and doesn't call `onPageChange`.
- Controlled: clicks only call `onPageChange`; the label and current page follow the `page` prop.

## Data Slots

| Slot                  | Element                                     |
| --------------------- | ------------------------------------------- |
| `pagination`          | Root `<nav>`                                |
| `pagination-label`    | "Page X of Y" live region (compact only)    |
| `pagination-ellipsis` | Collapsed gap in the window (numbered only) |
| `button`              | Each icon control and page number           |

## Accessibility

- The root is a `<nav>` landmark labelled "Pagination"; pass `aria-label` to rename it when a page has more than one.
- The "Page X of Y" label is `aria-live="polite"`, so page changes are announced.
- Each icon control has an accessible name ("First page", "Previous page", "Next page", "Last page") and a matching tooltip.
- Page numbers are named "Page N" and have no tooltip. The current page has `aria-current="page"`.
- Ellipses are `aria-hidden`; they're visual only.
- With `renderLink`, enabled controls are announced as links and listed with the page's links; disabled ones stay disabled buttons.
