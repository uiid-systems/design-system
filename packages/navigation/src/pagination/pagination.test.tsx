import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Pagination } from "./pagination";
import { clampPage, getPaginationItems } from "./pagination.utils";

const getLabel = () => document.querySelector("[data-slot='pagination-label']");
const getControl = (name: string) => screen.getByRole("button", { name });
const getEllipses = () =>
  document.querySelectorAll("[data-slot='pagination-ellipsis']");

/** The numbered window as rendered, e.g. `["1", "…", "5", "6", "7", "…", "31"]`. */
const getWindow = () =>
  Array.from(
    document.querySelectorAll(
      "[data-slot='pagination'] > [data-slot='button'], [data-slot='pagination-ellipsis']",
    ),
    (el) => el.textContent,
  );

const CONTROLS = ["First page", "Previous page", "Next page", "Last page"];

describe("clampPage", () => {
  it.each([
    { page: 5, totalPages: 10, expected: 5 },
    { page: 0, totalPages: 10, expected: 1 },
    { page: -3, totalPages: 10, expected: 1 },
    { page: 99, totalPages: 10, expected: 10 },
    { page: 1, totalPages: 1, expected: 1 },
    { page: 4, totalPages: 0, expected: 1 },
    { page: 4, totalPages: -2, expected: 1 },
  ])(
    "clamps page $page of $totalPages to $expected",
    ({ page, totalPages, expected }) => {
      expect(clampPage(page, totalPages)).toBe(expected);
    },
  );
});

describe("getPaginationItems", () => {
  const E = "ellipsis";

  it.each([
    // Window in the middle: both gaps collapse
    { page: 6, totalPages: 31, spread: 1, expected: [1, E, 5, 6, 7, E, 31] },
    // A gap of exactly one page is filled, not elided
    { page: 4, totalPages: 31, spread: 1, expected: [1, 2, 3, 4, 5, E, 31] },
    {
      page: 28,
      totalPages: 31,
      spread: 1,
      expected: [1, E, 27, 28, 29, 30, 31],
    },
    // Current page at either edge
    { page: 1, totalPages: 31, spread: 1, expected: [1, 2, E, 31] },
    { page: 31, totalPages: 31, spread: 1, expected: [1, E, 30, 31] },
    // Spread 0 shows only the current page between the ends
    { page: 6, totalPages: 31, spread: 0, expected: [1, E, 6, E, 31] },
    { page: 3, totalPages: 31, spread: 0, expected: [1, 2, 3, E, 31] },
    // Spread 2
    {
      page: 6,
      totalPages: 31,
      spread: 2,
      expected: [1, E, 4, 5, 6, 7, 8, E, 31],
    },
    {
      page: 5,
      totalPages: 31,
      spread: 2,
      expected: [1, 2, 3, 4, 5, 6, 7, E, 31],
    },
    // Small totals never need an ellipsis
    { page: 3, totalPages: 5, spread: 1, expected: [1, 2, 3, 4, 5] },
    { page: 1, totalPages: 2, spread: 1, expected: [1, 2] },
    // A single page, and a total below one
    { page: 1, totalPages: 1, spread: 1, expected: [1] },
    { page: 1, totalPages: 0, spread: 1, expected: [1] },
    // Out-of-range page is clamped; negative spread is treated as 0
    { page: 99, totalPages: 31, spread: 1, expected: [1, E, 30, 31] },
    { page: 6, totalPages: 31, spread: -1, expected: [1, E, 6, E, 31] },
  ])(
    "page $page of $totalPages, spread $spread",
    ({ page, totalPages, spread, expected }) => {
      expect(getPaginationItems(page, totalPages, spread)).toEqual(expected);
    },
  );
});

describe("Pagination", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a navigation landmark named Pagination", () => {
    render(<Pagination totalPages={31} />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toHaveAttribute("data-slot", "pagination");
  });

  it("renders a polite live label", () => {
    render(<Pagination totalPages={31} />);
    expect(getLabel()).toHaveTextContent("Page 1 of 31");
    expect(getLabel()).toHaveAttribute("aria-live", "polite");
  });

  it("renders the four icon controls", () => {
    render(<Pagination totalPages={31} />);
    for (const name of CONTROLS) {
      expect(getControl(name)).toBeInTheDocument();
    }
  });

  it("lets the consumer rename the landmark", () => {
    render(<Pagination totalPages={31} aria-label="Results pages" />);
    expect(
      screen.getByRole("navigation", { name: "Results pages" }),
    ).toBeInTheDocument();
  });

  // ============================================
  // UNCONTROLLED
  // ============================================

  it("advances to the next page and reports it", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={31} onPageChange={onPageChange} />);

    await user.click(getControl("Next page"));

    expect(getLabel()).toHaveTextContent("Page 2 of 31");
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("jumps to the last and first pages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={31} onPageChange={onPageChange} />);

    await user.click(getControl("Last page"));
    expect(getLabel()).toHaveTextContent("Page 31 of 31");
    expect(onPageChange).toHaveBeenLastCalledWith(31);

    await user.click(getControl("First page"));
    expect(getLabel()).toHaveTextContent("Page 1 of 31");
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it("steps back to the previous page", async () => {
    const user = userEvent.setup();
    render(<Pagination totalPages={31} defaultPage={5} />);

    await user.click(getControl("Previous page"));

    expect(getLabel()).toHaveTextContent("Page 4 of 31");
  });

  it("starts on defaultPage", () => {
    render(<Pagination totalPages={31} defaultPage={7} />);
    expect(getLabel()).toHaveTextContent("Page 7 of 31");
  });

  // ============================================
  // EDGES
  // ============================================

  it("disables First and Previous on the first page", () => {
    render(<Pagination totalPages={31} />);
    expect(getControl("First page")).toBeDisabled();
    expect(getControl("Previous page")).toBeDisabled();
    expect(getControl("Next page")).toBeEnabled();
    expect(getControl("Last page")).toBeEnabled();
  });

  it("disables Next and Last on the last page", () => {
    render(<Pagination totalPages={31} defaultPage={31} />);
    expect(getControl("First page")).toBeEnabled();
    expect(getControl("Previous page")).toBeEnabled();
    expect(getControl("Next page")).toBeDisabled();
    expect(getControl("Last page")).toBeDisabled();
  });

  it("enables every control on a middle page", () => {
    render(<Pagination totalPages={31} defaultPage={15} />);
    for (const name of CONTROLS) {
      expect(getControl(name)).toBeEnabled();
    }
  });

  // ============================================
  // CONTROLLED
  // ============================================

  it("reports clicks without moving off the page prop", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={31} page={3} onPageChange={onPageChange} />);

    await user.click(getControl("Next page"));

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(getLabel()).toHaveTextContent("Page 3 of 31");
  });

  it("follows the page prop when the parent updates it", async () => {
    const user = userEvent.setup();

    const ControlledPagination = () => {
      const [page, setPage] = useState(3);
      return <Pagination totalPages={31} page={page} onPageChange={setPage} />;
    };

    render(<ControlledPagination />);

    await user.click(getControl("Next page"));
    expect(getLabel()).toHaveTextContent("Page 4 of 31");

    await user.click(getControl("First page"));
    expect(getLabel()).toHaveTextContent("Page 1 of 31");
  });

  // ============================================
  // CLAMPING
  // ============================================

  it("clamps an out-of-range page to the last page", () => {
    render(<Pagination totalPages={10} page={99} />);
    expect(getLabel()).toHaveTextContent("Page 10 of 10");
  });

  it("clamps an out-of-range defaultPage to the last page", () => {
    render(<Pagination totalPages={10} defaultPage={99} />);
    expect(getLabel()).toHaveTextContent("Page 10 of 10");
  });

  it("treats zero pages as a single page with every control disabled", () => {
    render(<Pagination totalPages={0} />);
    expect(getLabel()).toHaveTextContent("Page 1 of 1");
    for (const name of CONTROLS) {
      expect(getControl(name)).toBeDisabled();
    }
  });

  // ============================================
  // NUMBERED
  // ============================================

  it("renders the numbered window around the current page", () => {
    render(<Pagination totalPages={31} defaultPage={6} spread={1} />);
    expect(getWindow()).toEqual(["1", "…", "5", "6", "7", "…", "31"]);
  });

  it("marks only the current page with aria-current", () => {
    render(<Pagination totalPages={31} defaultPage={6} spread={1} />);
    expect(getControl("Page 6")).toHaveAttribute("aria-current", "page");
    for (const name of ["Page 1", "Page 5", "Page 7", "Page 31"]) {
      expect(getControl(name)).not.toHaveAttribute("aria-current");
    }
  });

  it("hides the ellipses from assistive tech", () => {
    render(<Pagination totalPages={31} defaultPage={6} spread={1} />);
    expect(getEllipses()).toHaveLength(2);
    for (const ellipsis of getEllipses()) {
      expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("drops the label and First/Last but keeps Previous/Next", () => {
    render(<Pagination totalPages={31} defaultPage={6} spread={1} />);
    expect(getLabel()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "First page" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Last page" }),
    ).not.toBeInTheDocument();
    expect(getControl("Previous page")).toBeEnabled();
    expect(getControl("Next page")).toBeEnabled();
  });

  it("gives tooltips to Previous/Next but not to page numbers", () => {
    render(<Pagination totalPages={31} defaultPage={6} spread={1} />);
    const tooltipOf = (name: string) =>
      getControl(name).closest("[data-slot='button-tooltip-wrapper']");

    expect(tooltipOf("Previous page")).toBeInTheDocument();
    expect(tooltipOf("Next page")).toBeInTheDocument();
    expect(tooltipOf("Page 6")).not.toBeInTheDocument();
  });

  it("goes to a clicked page and reports it", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        totalPages={31}
        defaultPage={6}
        spread={1}
        onPageChange={onPageChange}
      />,
    );

    await user.click(getControl("Page 7"));

    expect(onPageChange).toHaveBeenCalledWith(7);
    expect(getControl("Page 7")).toHaveAttribute("aria-current", "page");
    expect(getWindow()).toEqual(["1", "…", "6", "7", "8", "…", "31"]);
  });

  it("does not report a click on the current page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        totalPages={31}
        defaultPage={6}
        spread={1}
        onPageChange={onPageChange}
      />,
    );

    await user.click(getControl("Page 6"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { rerender } = render(
      <Pagination totalPages={31} page={1} spread={1} />,
    );
    expect(getControl("Previous page")).toBeDisabled();
    expect(getControl("Next page")).toBeEnabled();

    rerender(<Pagination totalPages={31} page={31} spread={1} />);
    expect(getControl("Previous page")).toBeEnabled();
    expect(getControl("Next page")).toBeDisabled();
  });

  it("renders a single page with both controls disabled", () => {
    render(<Pagination totalPages={1} spread={1} />);
    expect(getWindow()).toEqual(["1"]);
    expect(getControl("Previous page")).toBeDisabled();
    expect(getControl("Next page")).toBeDisabled();
  });
});
