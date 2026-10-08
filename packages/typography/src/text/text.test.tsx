import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Text } from "./text";

describe("Text", () => {
  it("renders children in a span by default", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello").tagName).toBe("SPAN");
  });

  // ============================================
  // DATA ATTRIBUTES
  // ============================================
  // Text's props resolve from data-ui-* attributes in text.module.css, so the
  // attribute is what a prop is tested by.

  describe("data attributes", () => {
    // Size and family have no JavaScript default. A Text with no Text ancestor
    // paints step 0 sans from a zero-specificity baseline in text.module.css,
    // and a nested Text inherits its parent's run, so "unset" must stay
    // distinguishable from `size={0}` at the attribute level.
    it("writes no size or family when neither is set", () => {
      render(<Text>Defaults</Text>);
      const el = screen.getByText("Defaults");
      expect(el).not.toHaveAttribute("data-ui-size");
      expect(el).not.toHaveAttribute("data-ui-family");
      expect(el).not.toHaveAttribute("data-ui-weight");
      expect(el).not.toHaveAttribute("data-ui-shade");
    });

    it("writes an explicit baseline size and family", () => {
      render(
        <Text size={0} family="sans">
          Explicit
        </Text>,
      );
      const el = screen.getByText("Explicit");
      expect(el).toHaveAttribute("data-ui-size", "0");
      expect(el).toHaveAttribute("data-ui-family", "sans");
    });

    it("writes no size or family on a nested Text that names neither", () => {
      render(
        <Text size={-1} family="mono">
          Outer <Text weight="bold">inner</Text>
        </Text>,
      );
      const el = screen.getByText("inner");
      expect(el).not.toHaveAttribute("data-ui-size");
      expect(el).not.toHaveAttribute("data-ui-family");
      expect(el).toHaveAttribute("data-ui-weight", "bold");
    });

    it("writes exactly the size and family a nested Text names", () => {
      render(
        <Text size={2}>
          Outer{" "}
          <Text size={-1} family="mono">
            inner
          </Text>
        </Text>,
      );
      const el = screen.getByText("inner");
      expect(el).toHaveAttribute("data-ui-size", "-1");
      expect(el).toHaveAttribute("data-ui-family", "mono");
    });

    it("writes each enumerated prop as its value", () => {
      render(
        <Text size={-1} weight="bold" family="mono" shade="muted">
          Props
        </Text>,
      );
      const el = screen.getByText("Props");
      expect(el).toHaveAttribute("data-ui-size", "-1");
      expect(el).toHaveAttribute("data-ui-weight", "bold");
      expect(el).toHaveAttribute("data-ui-family", "mono");
      expect(el).toHaveAttribute("data-ui-shade", "muted");
    });

    it("pairs a color with its palette class", () => {
      render(<Text color="red">Red</Text>);
      const el = screen.getByText("Red");
      expect(el).toHaveAttribute("data-ui-color", "red");
      expect(el).toHaveClass("palette-red");
    });

    it("writes emphasis with the color's palette class", () => {
      render(
        <Text color="blue" emphasis="muted">
          Blue muted
        </Text>,
      );
      const el = screen.getByText("Blue muted");
      expect(el).toHaveAttribute("data-ui-emphasis", "muted");
      expect(el).toHaveClass("palette-blue");
      expect(el).not.toHaveClass("palette-neutral");
    });

    it("falls back to the neutral palette for emphasis without a color", () => {
      render(<Text emphasis="subtle">Subtle</Text>);
      const el = screen.getByText("Subtle");
      expect(el).toHaveAttribute("data-ui-emphasis", "subtle");
      expect(el).not.toHaveAttribute("data-ui-color");
      expect(el).toHaveClass("palette-neutral");
    });

    it("applies no palette class without a color or emphasis", () => {
      render(<Text>Plain</Text>);
      const el = screen.getByText("Plain");
      expect(el).not.toHaveAttribute("data-ui-emphasis");
      expect(el.className).not.toMatch(/palette-/);
    });

    it("writes a bare attribute for a toggle that is on", () => {
      render(
        <Text strikethrough balance truncate underline>
          Toggles
        </Text>,
      );
      const el = screen.getByText("Toggles");
      for (const key of ["strikethrough", "balance", "truncate", "underline"]) {
        expect(el).toHaveAttribute(`data-ui-${key}`, "");
      }
    });

    it("writes nothing for a toggle that is off", () => {
      render(
        <Text strikethrough={false} balance={false} truncate={false}>
          Off
        </Text>,
      );
      const el = screen.getByText("Off");
      for (const key of ["strikethrough", "balance", "truncate", "underline"]) {
        expect(el).not.toHaveAttribute(`data-ui-${key}`);
      }
    });

    it("writes underline={false} as an explicit value", () => {
      render(<Text underline={false}>No underline</Text>);
      expect(screen.getByText("No underline")).toHaveAttribute(
        "data-ui-underline",
        "false",
      );
    });
  });

  // ============================================
  // TRUNCATE TITLE
  // ============================================
  // When truncated, the full text is exposed as a native `title` tooltip so
  // clipped content stays readable on hover.

  describe("truncate title", () => {
    it("derives title from string children when truncate is set", () => {
      render(<Text truncate>A very long label that gets clipped</Text>);
      expect(
        screen.getByText("A very long label that gets clipped"),
      ).toHaveAttribute("title", "A very long label that gets clipped");
    });

    it("stringifies numeric children for the title", () => {
      render(<Text truncate>{42}</Text>);
      expect(screen.getByText("42")).toHaveAttribute("title", "42");
    });

    it("does not set a title when truncate is absent", () => {
      render(<Text>Plain text</Text>);
      expect(screen.getByText("Plain text")).not.toHaveAttribute("title");
    });

    it("lets an explicit title win over the derived one", () => {
      render(
        <Text truncate title="Custom tooltip">
          Derived
        </Text>,
      );
      expect(screen.getByText("Derived")).toHaveAttribute(
        "title",
        "Custom tooltip",
      );
    });

    it("does not derive a title from non-string children", () => {
      render(
        <Text truncate data-testid="rich">
          <em>Rich</em> content
        </Text>,
      );
      expect(screen.getByTestId("rich")).not.toHaveAttribute("title");
    });
  });
});
