import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Timeline } from "./timeline";
import { TimelineItem } from "./subcomponents";
import type { TimelineItemType } from "./timeline.types";

const ITEMS: TimelineItemType[] = [
  { title: "Order placed", time: "9:00 AM" },
  { title: "Shipped", description: "In transit" },
  { title: "Delivered" },
];

const getItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-slot="timeline-item"]'));

describe("Timeline", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a list with data-slot attributes", () => {
    render(<Timeline items={ITEMS} />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-slot", "timeline");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders the same output from items and children", () => {
    const { container: fromItems } = render(<Timeline items={ITEMS} />);
    const { container: fromChildren } = render(
      <Timeline>
        {ITEMS.map((item, i) => (
          <TimelineItem key={i} {...item} />
        ))}
      </Timeline>,
    );
    expect(fromItems.innerHTML).toBe(fromChildren.innerHTML);
  });

  it("applies custom className", () => {
    render(<Timeline items={ITEMS} className="custom-class" />);
    expect(screen.getByRole("list")).toHaveClass("custom-class");
  });

  // ============================================
  // STATUS DERIVATION
  // ============================================

  it("derives statuses from activeIndex", () => {
    const { container } = render(<Timeline items={ITEMS} activeIndex={1} />);
    const [first, second, third] = getItems(container);
    expect(first).toHaveAttribute("data-status", "completed");
    expect(second).toHaveAttribute("data-status", "active");
    expect(third).toHaveAttribute("data-status", "pending");
  });

  it("marks the active item with aria-current", () => {
    const { container } = render(<Timeline items={ITEMS} activeIndex={1} />);
    const [first, second] = getItems(container);
    expect(second).toHaveAttribute("aria-current", "step");
    expect(first).not.toHaveAttribute("aria-current");
  });

  it("defaults every item to pending without activeIndex", () => {
    const { container } = render(<Timeline items={ITEMS} />);
    for (const item of getItems(container)) {
      expect(item).toHaveAttribute("data-status", "pending");
    }
  });

  it("applies defaultStatus when activeIndex is absent", () => {
    const { container } = render(
      <Timeline items={ITEMS} defaultStatus="completed" />,
    );
    for (const item of getItems(container)) {
      expect(item).toHaveAttribute("data-status", "completed");
    }
  });

  it("lets a per-item status override the derived status", () => {
    const { container } = render(
      <Timeline
        items={[ITEMS[0], { ...ITEMS[1], status: "active" }, ITEMS[2]]}
        defaultStatus="completed"
      />,
    );
    const [first, second, third] = getItems(container);
    expect(first).toHaveAttribute("data-status", "completed");
    expect(second).toHaveAttribute("data-status", "active");
    expect(third).toHaveAttribute("data-status", "completed");
  });

  // ============================================
  // CONNECTORS
  // ============================================

  it("omits the connector on the last item", () => {
    const { container } = render(<Timeline items={ITEMS} />);
    const connectors = container.querySelectorAll(
      '[data-slot="timeline-connector"]',
    );
    expect(connectors).toHaveLength(2);
  });

  it("force-mounts the last connector when requested", () => {
    const { container } = render(
      <Timeline items={ITEMS} ConnectorProps={{ forceMount: true }} />,
    );
    const connectors = container.querySelectorAll(
      '[data-slot="timeline-connector"]',
    );
    expect(connectors).toHaveLength(3);
  });

  it("activates connectors below completed items", () => {
    const { container } = render(<Timeline items={ITEMS} activeIndex={1} />);
    const [first, second] = Array.from(
      container.querySelectorAll('[data-slot="timeline-connector"]'),
    );
    expect(first).toHaveAttribute("data-active");
    expect(second).not.toHaveAttribute("data-active");
  });

  it("activates all connectors when defaultStatus is completed", () => {
    const { container } = render(
      <Timeline items={ITEMS} defaultStatus="completed" />,
    );
    for (const connector of container.querySelectorAll(
      '[data-slot="timeline-connector"]',
    )) {
      expect(connector).toHaveAttribute("data-active");
    }
  });

  // ============================================
  // MARKER
  // ============================================

  it("renders a dot marker by default", () => {
    const { container } = render(<Timeline items={[ITEMS[0]]} />);
    const marker = container.querySelector('[data-slot="timeline-marker"]');
    expect(marker).toHaveAttribute("data-variant", "dot");
  });

  it("renders the marker node inside a content-variant marker", () => {
    const { container } = render(
      <Timeline items={[{ ...ITEMS[0], marker: <svg data-testid="icon" /> }]} />,
    );
    const marker = container.querySelector('[data-slot="timeline-marker"]');
    expect(marker).toHaveAttribute("data-variant", "content");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("flags the root when any item has a marker", () => {
    const { rerender } = render(<Timeline items={ITEMS} />);
    expect(screen.getByRole("list")).not.toHaveAttribute("data-has-markers");

    rerender(
      <Timeline items={[{ ...ITEMS[0], marker: <svg /> }, ITEMS[1]]} />,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-has-markers");
  });

  // ============================================
  // CARD VEHICLE
  // ============================================

  it("renders every item's content inside a Card", () => {
    const { container } = render(<Timeline items={ITEMS} />);
    const cards = container.querySelectorAll('[data-slot="card-container"]');
    expect(cards).toHaveLength(3);
  });

  it("renders the title and time inside the card header", () => {
    const { container } = render(
      <Timeline items={[{ title: "Order placed", time: "9:00 AM" }]} />,
    );
    const card = container.querySelector('[data-slot="card-container"]');
    expect(card?.querySelector('[data-slot="card-title"]')).toHaveTextContent(
      "Order placed",
    );
    expect(card?.querySelector("time")).toHaveTextContent("9:00 AM");
  });

  it("applies root CardProps to every card, merged under per-item values", () => {
    const { container } = render(
      <Timeline
        items={[
          { title: "Quiet row", CardProps: { variant: "ghost" } },
          { title: "Solid row" },
        ]}
        CardProps={{ className: "feed-card" }}
      />,
    );
    const cards = container.querySelectorAll('[data-slot="card-container"]');
    expect(cards[0]).toHaveClass("feed-card");
    expect(cards[0]).toHaveAttribute("data-variant", "ghost");
    expect(cards[1]).toHaveClass("feed-card");
    expect(cards[1]).not.toHaveAttribute("data-variant");
  });

  // ============================================
  // MEDIA
  // ============================================

  it("flags the root when any item has media", () => {
    const { rerender } = render(<Timeline items={ITEMS} />);
    expect(screen.getByRole("list")).not.toHaveAttribute("data-has-media");

    rerender(
      <Timeline items={[{ ...ITEMS[0], media: <span>AF</span> }, ITEMS[1]]} />,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-has-media");
  });

  // ============================================
  // GAP
  // ============================================

  it("maps gap to the row-gap custom property", () => {
    render(<Timeline items={ITEMS} gap={4} />);
    expect(screen.getByRole("list").style.getPropertyValue("--timeline-row-gap")).toBe(
      "calc(4 * var(--spacing-unit))",
    );
  });

  it("leaves the row-gap custom property unset without gap", () => {
    render(<Timeline items={ITEMS} />);
    expect(screen.getByRole("list").style.getPropertyValue("--timeline-row-gap")).toBe(
      "",
    );
  });

  // ============================================
  // SLOT PROPS
  // ============================================

  it("forwards root slot props to every item", () => {
    const { container } = render(
      <Timeline items={ITEMS} TitleProps={{ className: "title-slot" }} />,
    );
    expect(container.querySelectorAll(".title-slot")).toHaveLength(3);
  });

  it("merges per-item slot props over root slot props", () => {
    const { container } = render(
      <Timeline
        items={[
          { title: "First", TitleProps: { id: "first-title" } },
          { title: "Second" },
        ]}
        TitleProps={{ className: "title-slot" }}
      />,
    );
    const titles = container.querySelectorAll(".title-slot");
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveAttribute("id", "first-title");
    expect(titles[1]).not.toHaveAttribute("id");
  });

  it("forwards ItemProps to every list item", () => {
    const { container } = render(
      <Timeline items={ITEMS} ItemProps={{ className: "event-row" }} />,
    );
    expect(container.querySelectorAll("li.event-row")).toHaveLength(3);
  });
});
