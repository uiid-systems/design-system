import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Text } from "./text";

describe("Text", () => {
  it("renders children in a span by default", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello").tagName).toBe("SPAN");
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
