import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Table } from "./table";
import { TABLE_MOCK_DATA } from "./table.mocks";

/** happy-dom reports every box as zero-sized, so the scroll metrics the
 * affordance reads have to be stood up by hand. */
const setScrollMetrics = (
  element: HTMLElement,
  metrics: { scrollLeft: number; clientWidth: number; scrollWidth: number },
) => {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
};

const renderTable = () => {
  render(<Table items={TABLE_MOCK_DATA} />);

  const scroller = document.querySelector<HTMLElement>(
    '[data-slot="table-scroller"]',
  );
  if (!scroller) throw new Error("table scroller not found");

  return { container: scroller.parentElement as HTMLElement, scroller };
};

describe("Table", () => {
  it("renders its rows", () => {
    renderTable();
    expect(screen.getByText("Alex Thompson")).toBeInTheDocument();
  });

  it("marks the scroll container with a data-slot", () => {
    const { scroller } = renderTable();
    expect(scroller).toHaveAttribute("data-slot", "table-scroller");
  });

  it("shows no edge shadows when the table fits", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 0,
      clientWidth: 800,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).not.toHaveAttribute("data-scroll-start");
      expect(container).not.toHaveAttribute("data-scroll-end");
    });
  });

  it("shows only the end shadow when content overflows to the right", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 0,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).not.toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });

  it("shows both shadows mid-scroll", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 200,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });

  it("shows only the start shadow at the far end", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 400,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).not.toHaveAttribute("data-scroll-end");
    });
  });

  it("treats a negative scroll offset as distance from the start", async () => {
    const { container, scroller } = renderTable();

    /* RTL counts scrollLeft down from zero, so the sign carries no meaning. */
    setScrollMetrics(scroller, {
      scrollLeft: -200,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });
});
