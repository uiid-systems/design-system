import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, it, expect } from "vitest";

import { Badge } from "./badge";
import * as Examples from "./badge.examples";

import styles from "./badge.module.css";

const part = (container: HTMLElement, slot: string) =>
  container.querySelector(`[data-slot='${slot}']`);

describe("Badge", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the root with the label inside it", () => {
    const { container } = render(<Badge>New</Badge>);
    const root = part(container, "badge");
    expect(root).toBe(container.firstElementChild);
    expect(part(container, "badge-text")).toHaveTextContent("New");
    expect(root).toContainElement(part(container, "badge-text") as HTMLElement);
  });

  it("merges className onto the root", () => {
    const { container } = render(<Badge className="custom">New</Badge>);
    const root = part(container, "badge");
    expect(root).toHaveClass("custom");
    expect(root).toHaveClass(styles["badge"]);
  });

  it("forwards ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Badge ref={ref}>New</Badge>);
    expect(ref.current).toBe(part(container, "badge"));
  });

  it("passes remaining props to the root", () => {
    render(
      <Badge data-testid="badge" id="count" aria-label="3 unread" p={2}>
        3
      </Badge>,
    );
    const root = screen.getByTestId("badge");
    expect(root).toHaveAttribute("data-slot", "badge");
    expect(root).toHaveAttribute("id", "count");
    expect(root).toHaveAttribute("aria-label", "3 unread");
    expect(root).toHaveAttribute("data-ui-p", "2");
  });

  it("lets layout props override its defaults", () => {
    const { container } = render(
      <Badge gap={3} ay="start">
        New
      </Badge>,
    );
    const root = part(container, "badge");
    expect(root).toHaveAttribute("data-ui-gap", "3");
    expect(root).toHaveAttribute("data-ui-ay", "start");
  });

  // ============================================
  // VARIANTS
  // ============================================

  it("defaults to the medium size", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(part(container, "badge")).toHaveClass(styles["size-medium"]);
  });

  it.each(["small", "medium", "large"] as const)(
    "applies the %s size",
    (size) => {
      const { container } = render(<Badge size={size}>New</Badge>);
      expect(part(container, "badge")).toHaveClass(styles[`size-${size}`]);
    },
  );

  it("pairs a color with the tinted treatment", () => {
    const { container } = render(<Badge color="green">New</Badge>);
    const root = part(container, "badge");
    expect(root).toHaveClass("palette-green");
    expect(root).toHaveClass(styles["colored"]);
  });

  it("stays on its shade defaults without a color", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(part(container, "badge")).not.toHaveClass(styles["colored"]);
  });
});

describe("Badge examples", () => {
  it.each(Object.entries(Examples))("%s renders a badge", (_, Example) => {
    const { container } = render(<Example />);
    expect(part(container, "badge")).toBeInTheDocument();
  });
});
