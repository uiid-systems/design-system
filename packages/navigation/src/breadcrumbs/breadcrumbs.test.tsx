import { render, screen, within } from "@testing-library/react";
import { HomeIcon } from "@uiid/icons/house";
import { describe, it, expect, expectTypeOf } from "vitest";

import * as Navigation from "../index";
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsList } from "./breadcrumbs";
import * as Examples from "./breadcrumbs.examples";
import { MOCK_ITEMS } from "./breadcrumbs.mocks";
import type {
  BreadcrumbsItemData,
  BreadcrumbsProps,
} from "./breadcrumbs.types";

const getItems = () =>
  document.querySelectorAll("[data-slot='breadcrumbs-item']");

describe("Breadcrumbs", () => {
  it("renders a nav landmark around an ordered list", () => {
    render(<Breadcrumbs items={MOCK_ITEMS} />);
    const nav = screen.getByRole("navigation", { name: "breadcrumbs" });
    expect(nav).toHaveAttribute("data-slot", "breadcrumbs");
    const list = within(nav).getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list).toHaveAttribute("data-slot", "breadcrumbs-list");
  });

  it("renders every crumb but the last as a link to its value", () => {
    render(<Breadcrumbs items={MOCK_ITEMS} />);
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Home", "About"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/about",
    ]);
    expect(screen.queryByRole("link", { name: "Contact" })).toBeNull();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe("accessibility", () => {
    it("marks only the last crumb as the current page", () => {
      render(<Breadcrumbs items={MOCK_ITEMS} />);
      const items = Array.from(getItems());
      expect(items).toHaveLength(3);
      expect(items.at(-1)).toHaveAttribute("aria-current", "page");
      expect(items.at(-1)).toHaveTextContent("Contact");
      for (const item of items.slice(0, -1)) {
        expect(item).not.toHaveAttribute("aria-current");
      }
    });

    it("marks a single crumb as the current page", () => {
      render(<Breadcrumbs items={[{ label: "Home", value: "/" }]} />);
      expect(getItems()[0]).toHaveAttribute("aria-current", "page");
      expect(screen.queryByRole("link")).toBeNull();
    });

    it("hides the separators from assistive technology", () => {
      render(<Breadcrumbs items={MOCK_ITEMS} />);
      const separators = document.querySelectorAll(
        "[data-slot='breadcrumbs-separator']",
      );
      expect(separators).toHaveLength(2);
      for (const separator of separators) {
        expect(separator).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("takes an aria-label to rename the landmark", () => {
      render(<Breadcrumbs items={MOCK_ITEMS} aria-label="You are here" />);
      expect(
        screen.getByRole("navigation", { name: "You are here" }),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // LAYOUT
  // ============================================
  // The list is a Group, so it lays out through style props, not module CSS.

  it("lays the list out as a wrapping Group", () => {
    render(<Breadcrumbs items={MOCK_ITEMS} />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-ui-wrap");
    expect(list).toHaveAttribute("data-ui-gap", "2");
    expect(list).toHaveAttribute("data-ui-ay", "center");
  });

  it("passes ol attributes through BreadcrumbsList", () => {
    render(
      <BreadcrumbsList start={3} reversed type="i">
        <BreadcrumbsItem>Crumb</BreadcrumbsItem>
      </BreadcrumbsList>,
    );
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list).toHaveAttribute("start", "3");
    expect(list).toHaveAttribute("reversed");
    expect(list).toHaveAttribute("type", "i");
  });

  it("renders an item's icon alongside its label", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", value: "/", icon: HomeIcon },
          { label: "About", value: "/about" },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link.querySelector("svg")).not.toBeNull();
  });

  it("renders links with a custom linkAs component", () => {
    const Link = ({
      href,
      children,
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      <a href={href} data-custom-link="">
        {children}
      </a>
    );
    render(<Breadcrumbs items={MOCK_ITEMS} linkAs={Link} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("data-custom-link");
    }
  });

  it("spreads remaining props onto the nav", () => {
    render(<Breadcrumbs items={MOCK_ITEMS} className="custom" p={2} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom");
    expect(nav).toHaveAttribute("data-ui-p", "2");
  });

  // ============================================
  // EXPORTS
  // ============================================

  it("exports the component and its subcomponents from the package", () => {
    expect(Navigation.Breadcrumbs).toBe(Breadcrumbs);
    expect(Navigation.BreadcrumbsContainer).toBeDefined();
    expect(Navigation.BreadcrumbsList).toBeDefined();
    expect(Navigation.BreadcrumbsItem).toBeDefined();
    expect(Navigation.BreadcrumbsSeparator).toBeDefined();
  });

  it("types items as BreadcrumbsItemData", () => {
    expectTypeOf<BreadcrumbsProps["items"]>().toEqualTypeOf<
      BreadcrumbsItemData[]
    >();
    expectTypeOf<Navigation.BreadcrumbsItemData>().toEqualTypeOf<BreadcrumbsItemData>();
    expectTypeOf<Navigation.BreadcrumbsContainerProps>().toEqualTypeOf<
      Omit<BreadcrumbsProps, "items">
    >();
    expectTypeOf<Navigation.BreadcrumbsProps>().toEqualTypeOf<BreadcrumbsProps>();
  });

  // ============================================
  // EXAMPLES
  // ============================================

  it.each(Object.entries(Examples))(
    "marks the last crumb current in the %s example",
    (_, Example) => {
      render(<Example />);
      const items = Array.from(getItems());
      expect(items.at(-1)).toHaveAttribute("aria-current", "page");
      expect(items.at(-1)).toHaveTextContent("Breadcrumbs");
    },
  );
});
