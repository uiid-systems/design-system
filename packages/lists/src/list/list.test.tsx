import { render, screen } from "@testing-library/react";
import { StarIcon } from "@uiid/icons/star";
import { describe, it, expect } from "vitest";

import { List } from "./list";
import {
  ListDescription,
  ListGroup,
  ListGroupHeader,
  ListItem,
  ListLabel,
} from "./subcomponents";

// Imported with the `?raw` suffix rather than read from disk: `pnpm typecheck`
// pins its `types` to vitest and jest-dom, so a builtin import fails to
// resolve. vite/client declares the suffix, and
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
  // did they reach nested groups, whose items also lacked a full width.

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

    it("applies ItemProps and a full width to items in nested groups", () => {
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
        expect(itemByLabel(label)).toHaveAttribute("data-ui-w", "full");
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
      expect(itemByLabel("Nested")).toHaveAttribute("data-ui-w", "full");
      expect(itemByLabel("Top")).toHaveAttribute("data-ui-w", "full");
    });

    // Internal layout reads `w="full"`, so a caller's own `w` in ItemProps or
    // GroupProps can narrow a row.
    it("fills the width with w", () => {
      const { container } = render(
        <List
          category="Section"
          items={[
            { label: "Top", icon: StarIcon },
            { category: "Group", items: [{ label: "Nested" }] },
          ]}
        />,
      );
      for (const slot of [
        "list-section",
        "list-group",
        "list-group-header",
        "list-item",
      ]) {
        expect(
          container.querySelector(`[data-slot="${slot}"]`),
        ).toHaveAttribute("data-ui-w", "full");
      }
    });

    it("lets ItemProps narrow an item's width", () => {
      render(<List ItemProps={{ w: 200 }} items={[{ label: "Narrow" }]} />);
      expect(itemByLabel("Narrow")).toHaveAttribute("data-ui-w", "200");
    });

    it("lets GroupProps narrow a group's width", () => {
      const { container } = render(
        <List
          GroupProps={{ w: 200 }}
          items={[{ category: "Group", items: [{ label: "Leaf" }] }]}
        />,
      );
      const group = container.querySelector('[data-slot="list-group"]');
      expect(group).toHaveAttribute("data-ui-w", "200");
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
        expect(group).toHaveClass("shared-group");
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
  // inline-style ban in `.claude/rules/styling.md`, and the first is what made the
  // icon un-themeable: an inline declaration outranks every rule, so no
  // surface could recolour it. They now live in `list.module.css`.
  //
  // The assertion targets those two properties rather than the `style`
  // attribute itself. `Box`/`Group`/`Stack` compile their layout props down to
  // inline `gap`/`align-items`, which is the sanctioned mechanism — first in
  // the resolution order the styling rule sets out — so a blanket "no style
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

    /* The label names the row. An icon of the caller's own that carries a
       `<title>` must not add its text to that name. */
    it("hides the icon from assistive tech", () => {
      const TitledIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props}>
          <title>Star</title>
        </svg>
      );
      render(<ListItem label="Feature" icon={TitledIcon} />);
      expect(
        document.querySelector('[data-slot="list-item-icon"]'),
      ).toHaveAttribute("aria-hidden", "true");
    });

    it("leaves the icon's colour to CSS rather than the element", () => {
      render(<ListItem label="Feature" icon={StarIcon} />);
      expect(
        document.querySelector('[data-slot="list-item-icon"]'),
      ).not.toHaveAttribute("style");
    });
  });
});

// ============================================
// MARKERS
// ============================================
// The marker used to be drawn by `display: list-item` on the label, so only a
// label-only row got one: an icon row suppressed it and composed children had
// no label to carry it. A `::before` counter for composed rows read 1, 1, 2 in
// a mixed decimal list. Now every row of a marked List stamps its List's marker
// on its own `<li>`, the stylesheet makes that `<li>` a native list item, and
// the row's flex layout moves to an inner element.
//
// happy-dom resolves neither `display: list-item` nor `::marker`, so these
// assert the markup the rule targets. Numbering and baseline are verified in
// Storybook.

describe("List markers", () => {
  const rowsOf = (root: ParentNode) => [
    ...root.querySelectorAll<HTMLElement>("li"),
  ];

  it("stamps the marker on every row shape of a marked list", () => {
    const { container } = render(
      <List marker="decimal">
        <ListItem label="Label" />
        <ListItem label="Icon" icon={StarIcon} />
        <ListItem>
          <span>Children</span>
        </ListItem>
        <ListGroup category="Group" items={[{ label: "Nested" }]} />
      </List>,
    );
    const rows = rowsOf(container);
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      expect(row).toHaveAttribute("data-list-marker", "decimal");
    }
  });

  it("stamps nothing on the rows of an unmarked list", () => {
    const { container } = render(<List items={[{ label: "Feature" }]} />);
    expect(rowsOf(container)[0]).not.toHaveAttribute("data-list-marker");
  });

  it("keeps a marked row's layout props on an inner flex element", () => {
    render(
      <List marker="disc">
        <ListItem gap={2} className="row">
          <span>Children</span>
        </ListItem>
      </List>,
    );
    const row = screen.getByText("Children").closest("li");
    expect(row).toHaveClass("row");
    expect(row).not.toHaveAttribute("data-ui-gap");
    expect(
      row?.querySelector('[data-slot="list-item-layout"]'),
    ).toHaveAttribute("data-ui-gap", "2");
  });

  it("leaves an unmarked list's row as its own flex layout", () => {
    render(
      <List>
        <ListItem gap={2} label="Feature" />
      </List>,
    );
    const row = screen.getByText("Feature").closest("li");
    expect(row).toHaveAttribute("data-ui-gap", "2");
    expect(row?.querySelector('[data-slot="list-item-layout"]')).toBeNull();
  });

  it("does not mark the rows of an unmarked list nested in a marked row", () => {
    render(
      <List marker="decimal">
        <ListItem>
          <List items={[{ label: "Inner" }]} />
        </ListItem>
      </List>,
    );
    const inner = screen.getByText("Inner").closest("li");
    expect(inner).not.toHaveAttribute("data-list-marker");
    expect(inner?.parentElement?.closest("li")).toHaveAttribute(
      "data-list-marker",
      "decimal",
    );
  });

  it("renders a nested group's panel as an ol under a decimal marker", () => {
    const { container } = render(
      <List
        marker="decimal"
        items={[{ category: "Group", items: [{ label: "Nested" }] }]}
      />,
    );
    expect(
      container.querySelector('[data-slot="list-group-panel"]')?.tagName,
    ).toBe("OL");
  });

  it("keeps a nested group's panel a ul under a bullet marker", () => {
    const { container } = render(
      <List
        marker="disc"
        items={[{ category: "Group", items: [{ label: "Nested" }] }]}
      />,
    );
    expect(
      container.querySelector('[data-slot="list-group-panel"]')?.tagName,
    ).toBe("UL");
  });

  it("makes the stamped row, not the label, the list item", () => {
    expect(listCss).toContain("[data-list-marker]");
    expect(listCss).toContain("display: list-item");
    expect(listCss).not.toMatch(/\.list-text-label \{[^}]*display/);
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

describe("List parts composed by hand", () => {
  it("put a label and description inside an item", () => {
    render(
      <List>
        <ListItem>
          <ListLabel>Invoices</ListLabel>
          <ListDescription>Sent this month</ListDescription>
        </ListItem>
      </List>,
    );

    const item = screen.getByRole("listitem");
    expect(item).toContainElement(screen.getByText("Invoices"));
    expect(item).toContainElement(screen.getByText("Sent this month"));
    expect(screen.getByText("Invoices")).toHaveAttribute(
      "data-slot",
      "list-text-label",
    );
    expect(screen.getByText("Sent this month")).toHaveAttribute(
      "data-slot",
      "list-text-description",
    );
  });

  it("render the group header as a heading only with a category", () => {
    const { container, rerender } = render(
      <ListGroupHeader category="Billing" />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Billing" }),
    ).toBeInTheDocument();

    rerender(<ListGroupHeader />);
    expect(container).toBeEmptyDOMElement();
  });
});
