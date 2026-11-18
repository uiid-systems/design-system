import { render, screen } from "@testing-library/react";
import { StarIcon } from "@uiid/icons/star";
import { describe, it, expect } from "vitest";

import { List } from "./list";
import { ListGroup, ListItem } from "./subcomponents";

// Imported with the `?raw` suffix rather than read from disk: this package
// builds with `tsc -b` and pins its `types` to vitest and jest-dom, so a
// builtin import fails to resolve. vite/client declares the suffix, and
// vite-env.d.ts already references it.
import listCss from "./list.module.css?raw";
import styles from "./list.module.css";

describe("List", () => {
  it("renders each item's label", () => {
    render(<List items={[{ label: "Feature" }, { label: "Fix" }]} />);
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Fix")).toBeInTheDocument();
  });

  // A caller's className used to replace `.list` instead of joining it, which
  // took `.list:where([data-marker="none"])` and its `list-style: none` with it.
  // Base UI's Select.List passes `base-ui-disable-scrollbar` this way, so every
  // Select option drew a disc bullet.
  it("keeps its own class when given a className", () => {
    const { container } = render(
      <List className="caller" marker="none" items={[{ label: "Feature" }]} />,
    );
    expect(container.querySelector('[data-slot="list"]')).toHaveClass(
      styles["list"],
      "caller",
    );
  });

  // ============================================
  // SHARED ITEM AND GROUP PROPS
  // ============================================
  // ItemProps and GroupProps are defaults. They used to be spread after each
  // entry, so a shared value replaced the entry's own, and GroupProps (then
  // typed as ListGroupProps) could wipe every group's heading or items. Nor
  // did they reach nested groups, whose items also lacked `fullwidth`.

  describe("ItemProps and GroupProps", () => {
    const itemByLabel = (label: string) =>
      screen.getByText(label).closest('[data-slot="list-item"]');

    it("lets an item's own value win over ItemProps", () => {
      render(
        <List
          ItemProps={{ label: "Shared", id: "shared" }}
          items={[{ label: "Own", id: "own" }]}
        />,
      );
      expect(screen.getByText("Own")).toBeInTheDocument();
      expect(screen.queryByText("Shared")).not.toBeInTheDocument();
      expect(itemByLabel("Own")).toHaveAttribute("id", "own");
    });

    it("joins the shared className with the item's own", () => {
      render(
        <List
          ItemProps={{ className: "shared" }}
          items={[{ label: "Own", className: "own" }]}
        />,
      );
      expect(itemByLabel("Own")).toHaveClass("shared", "own");
    });

    it("applies ItemProps and fullwidth to items in nested groups", () => {
      render(
        <List
          ItemProps={{ className: "shared" }}
          items={[
            {
              category: "Outer",
              items: [
                { label: "Child" },
                { category: "Inner", items: [{ label: "Grandchild" }] },
              ],
            },
          ]}
        />,
      );
      for (const label of ["Child", "Grandchild"]) {
        expect(itemByLabel(label)).toHaveClass("shared");
        expect(itemByLabel(label)).toHaveAttribute("data-ui-fullwidth");
      }
    });

    it("renders grouped items like top-level ones", () => {
      render(
        <List
          items={[
            { label: "Top" },
            { category: "Group", items: [{ label: "Nested" }] },
          ]}
        />,
      );
      expect(itemByLabel("Nested")).toHaveAttribute("data-ui-fullwidth");
      expect(itemByLabel("Top")).toHaveAttribute("data-ui-fullwidth");
    });

    it("applies GroupProps to every group's root without touching its content", () => {
      const { container } = render(
        <List
          GroupProps={{ className: "shared-group", gap: 2 }}
          items={[
            {
              category: "Outer",
              items: [{ category: "Inner", items: [{ label: "Leaf" }] }],
            },
          ]}
        />,
      );
      const groups = container.querySelectorAll('[data-slot="list-group"]');
      expect(groups).toHaveLength(2);
      for (const group of groups) {
        expect(group).toHaveClass(styles["list-group"], "shared-group");
        expect(group).toHaveAttribute("data-ui-gap", "2");
      }
      expect(screen.getByText("Outer")).toBeInTheDocument();
      expect(screen.getByText("Inner")).toBeInTheDocument();
      expect(screen.getByText("Leaf")).toBeInTheDocument();
    });

    it("merges a group entry's own ItemProps and GroupProps with the inherited ones", () => {
      const { container } = render(
        <List
          ItemProps={{ className: "shared", id: "shared-id" }}
          GroupProps={{ className: "shared-group", gap: 2 }}
          items={[
            {
              category: "Group",
              ItemProps: { className: "own", id: "own-id" },
              GroupProps: { className: "own-group" },
              items: [{ label: "Nested" }],
            },
          ]}
        />,
      );
      expect(itemByLabel("Nested")).toHaveClass("shared", "own");
      expect(itemByLabel("Nested")).toHaveAttribute("id", "own-id");
      const group = container.querySelector('[data-slot="list-group"]');
      expect(group).toHaveClass("shared-group", "own-group");
      expect(group).toHaveAttribute("data-ui-gap", "2");
    });

    it("takes ItemProps on a hand-composed ListGroup", () => {
      render(
        <List>
          <ListGroup
            category="Group"
            ItemProps={{ className: "shared" }}
            items={[{ label: "Nested" }]}
          />
        </List>,
      );
      expect(itemByLabel("Nested")).toHaveClass("shared");
    });
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

  it("styles only the icon prop's class, not every svg in the item", () => {
    expect(listCss).toContain(".list-item-icon {");
    expect(listCss).not.toMatch(/\[data-slot/);
    expect(listCss).not.toMatch(/\.list-item svg/);
  });

  it("falls back to --shade-muted for the description", () => {
    expect(listCss).toContain(
      "color: var(--list-description-color, var(--shade-muted))",
    );
  });
});
