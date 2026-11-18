import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";

import { Status } from "./status";
import * as Examples from "./status.examples";

import styles from "./status.module.css";

const part = (container: HTMLElement, slot: string) =>
  container.querySelector(`[data-slot='${slot}']`);

/** Both shapes: the dot alone, and the dot with a label. */
const shapes = [
  { name: "without children", children: undefined },
  { name: "with children", children: "Online" },
];

describe("Status", () => {
  describe.each(shapes)("$name", ({ children }) => {
    it("renders the root with the dot inside it", () => {
      const { container } = render(<Status>{children}</Status>);
      const root = part(container, "status");
      expect(root).toBeInTheDocument();
      expect(root).toBe(container.firstElementChild);
      expect(root).toContainElement(
        part(container, "status-dot") as HTMLElement,
      );
    });

    it("renders a span root, so it is valid in running text", () => {
      const { container } = render(<Status>{children}</Status>);
      expect(part(container, "status")?.tagName).toBe("SPAN");
    });

    it("merges className onto the root", () => {
      const { container } = render(
        <Status className="custom">{children}</Status>,
      );
      const root = part(container, "status");
      expect(root).toHaveClass("custom");
      expect(root).toHaveClass(styles["status"]);
    });

    it("forwards ref to the root", () => {
      const ref = createRef<HTMLDivElement>();
      const { container } = render(<Status ref={ref}>{children}</Status>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current).toBe(part(container, "status"));
    });

    it("passes role and aria-label to the root", () => {
      render(
        <Status role="img" aria-label="Server online" color="green">
          {children}
        </Status>,
      );
      expect(
        screen.getByRole("img", { name: "Server online" }),
      ).toHaveAttribute("data-slot", "status");
    });

    it("passes remaining props to the root", () => {
      const { container } = render(
        <Status data-testid="status" id="server" p={2}>
          {children}
        </Status>,
      );
      const root = part(container, "status");
      expect(root).toHaveAttribute("data-testid", "status");
      expect(root).toHaveAttribute("id", "server");
      expect(root).toHaveAttribute("data-ui-p", "2");
    });
  });

  it("nests in a paragraph without a React nesting error", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <p>
        Server <Status color="green" /> online
      </p>,
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("renders a zero as the label", () => {
    const { container } = render(<Status>{0}</Status>);
    expect(part(container, "status-text")).toHaveTextContent("0");
  });

  it("renders no text part without children", () => {
    const { container } = render(<Status />);
    expect(part(container, "status-text")).not.toBeInTheDocument();
    expect(part(container, "status")?.children).toHaveLength(1);
  });

  it("renders children in the text part", () => {
    const { container } = render(<Status>Online</Status>);
    expect(part(container, "status-text")).toHaveTextContent("Online");
  });

  it("applies the variants to the dot, not the root", () => {
    const { container } = render(<Status color="green" pulse inverted />);
    const dot = part(container, "status-dot");
    expect(dot).toHaveAttribute("data-colored");
    expect(dot).toHaveClass(styles["toggle-pulse"]);
    expect(dot).toHaveClass(styles["toggle-inverted"]);
    expect(part(container, "status")).not.toHaveClass(styles["toggle-pulse"]);
  });

  it("leaves the dot uncolored by default", () => {
    const { container } = render(<Status />);
    expect(part(container, "status-dot")).not.toHaveAttribute("data-colored");
  });
});

describe("Status examples", () => {
  it.each(Object.entries(Examples))("%s renders a status", (_, Example) => {
    const { container } = render(<Example />);
    expect(part(container, "status-dot")).toBeInTheDocument();
  });
});
