import { render, screen } from "@testing-library/react";
import { StarIcon } from "@uiid/icons/star";
import { describe, it, expect } from "vitest";

import { List } from "./list";
import { ListItem } from "./subcomponents";

// Imported with the `?raw` suffix rather than read from disk: this package
// builds with `tsc -b` and pins its `types` to vitest and jest-dom, so a
// builtin import fails to resolve. vite/client declares the suffix, and
// vite-env.d.ts already references it.
import listCss from "./list.module.css?raw";

describe("List", () => {
  it("renders each item's label", () => {
    render(<List items={[{ label: "Feature" }, { label: "Fix" }]} />);
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Fix")).toBeInTheDocument();
  });

  // ============================================
  // NO INLINE STYLES
  // ============================================
  // `list-item.tsx` used to pin the icon's colour with
  // `style={{ color: "var(--shade-foreground)" }}` and suppress the label's
  // marker with `style={{ listStyleType: "none" }}`. Both violated the
  // inline-style ban in `.agents/styling.md`, and the first is what made the
  // icon un-themeable: an inline declaration outranks every rule, so no
  // surface could recolour it. They now live in `list.module.css`.
  //
  // The assertion targets those two properties rather than the `style`
  // attribute itself. `Box`/`Group`/`Stack` compile their layout props down to
  // inline `gap`/`align-items`, which is the sanctioned mechanism — first in
  // the resolution order the styling chapter sets out — so a blanket "no style
  // attribute" check would fail on markup that is entirely correct.

  describe("inline styles", () => {
    const inlineStyles = (root: HTMLElement) =>
      [...root.querySelectorAll("[style]")].map(
        (el) => el.getAttribute("style") ?? "",
      );

    it("sets no colour or list-style inline on a plain item", () => {
      const { container } = render(<List items={[{ label: "Feature" }]} />);
      expect(inlineStyles(container).join(" ")).not.toMatch(
        /(^|[\s;])(color|list-style-type)\s*:/,
      );
    });

    it("sets no colour or list-style inline on an item with an icon and description", () => {
      const { container } = render(
        <List
          items={[
            {
              label: "Feature",
              description: "A net-new capability",
              icon: StarIcon,
            },
          ]}
        />,
      );
      expect(inlineStyles(container).join(" ")).not.toMatch(
        /(^|[\s;])(color|list-style-type)\s*:/,
      );
    });

    it("leaves the icon's colour to CSS rather than the element", () => {
      render(<ListItem label="Feature" icon={StarIcon} />);
      expect(
        document.querySelector('[data-slot="list-item-icon"]'),
      ).not.toHaveAttribute("style");
    });

    it("moves the icon row's list-style suppression onto a class", () => {
      render(<ListItem label="Feature" icon={StarIcon} />);
      const row = screen
        .getByText("Feature")
        .closest("[class*='list-item-content']");
      expect(row).not.toBeNull();
    });
  });
});

// ============================================
// THEMING HOOKS
// ============================================
// The icon and description read names this package does not own, so a themed
// surface (the forms popup) can publish them for its subtree without @uiid/lists
// depending on the palette. The fallback in each `var()` is the token that was
// hard-coded before, which is what keeps an uncoloured List byte-identical.
//
// Asserted against the stylesheet source rather than `getComputedStyle`:
// happy-dom does not resolve custom properties at all — it returns "" for any
// `var()`-valued declaration — so a computed-style assertion here would pass
// whatever the CSS said. The rendered result is verified in Storybook.

describe("list.module.css theming hooks", () => {
  it("falls back to --shade-foreground for the icon", () => {
    expect(listCss).toContain(
      "color: var(--list-icon-color, var(--shade-foreground))",
    );
  });

  it("falls back to --shade-muted for the description", () => {
    expect(listCss).toContain(
      "color: var(--list-description-color, var(--shade-muted))",
    );
  });
});
