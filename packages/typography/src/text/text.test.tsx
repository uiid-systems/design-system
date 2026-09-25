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
    it("writes the default size and family", () => {
      render(<Text>Defaults</Text>);
      const el = screen.getByText("Defaults");
      expect(el).toHaveAttribute("data-ui-size", "0");
      expect(el).toHaveAttribute("data-ui-family", "sans");
      expect(el).not.toHaveAttribute("data-ui-weight");
      expect(el).not.toHaveAttribute("data-ui-shade");
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
      render(<Text strikethrough={false}>Off</Text>);
      expect(screen.getByText("Off")).not.toHaveAttribute(
        "data-ui-strikethrough",
      );
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
