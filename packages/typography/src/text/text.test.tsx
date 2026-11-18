import { render, screen } from "@testing-library/react";
import { describe, it, expect, expectTypeOf } from "vitest";

import { Text } from "./text";
import * as Examples from "./text.examples";
import type { TextProps } from "./text.types";

import styles from "./text.module.css";
import css from "./text.module.css?raw";

/**
 * The selector of every text.module.css rule that sets `color` to `value`, in source order.
 * Only flat top-level `selector { declarations }` rules are seen: a rule nested inside another (like `.text`'s `code`) is skipped, which is fine for the data-ui-* rules this reads.
 */
const selectorsPainting = (value: string) =>
  [
    ...css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .matchAll(/(?<=^|\})\s*([^{}]+)\{([^{}]*)\}/g),
  ]
    .filter(([, , body]) => body.includes(`color: ${value};`))
    .map(([, selector]) => ({
      selector: selector.trim().replace(/\.text\b/g, `.${styles["text"]}`),
      at: css.indexOf(selector.trim()),
    }));

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

    it("resolves padding and margin but takes no gap", () => {
      expectTypeOf<TextProps>().not.toHaveProperty("gap");
      render(
        <Text p={1} mx="auto">
          Spaced
        </Text>,
      );
      const el = screen.getByText("Spaced");
      expect(el).toHaveAttribute("data-ui-p", "1");
      expect(el).toHaveAttribute("data-ui-mx", "auto");
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

    it("paints muted emphasis without a color as the page's muted shade", () => {
      render(
        <>
          <Text emphasis="muted">Page muted</Text>
          <Text color="neutral" emphasis="muted">
            Fill muted
          </Text>
        </>,
      );
      const isMuted = ({ selector }: { selector: string }) =>
        selector.includes('[data-ui-emphasis="muted"]');
      const page = selectorsPainting("var(--shade-muted)").find(isMuted);
      const fill = selectorsPainting("var(--palette-on-fill)").find(isMuted);
      if (!page || !fill) throw new Error("missing a muted emphasis rule");
      expect(screen.getByText("Page muted").matches(page.selector)).toBe(true);
      expect(screen.getByText("Fill muted").matches(page.selector)).toBe(false);
      // Both weigh one attribute, so the page rule wins only by coming later.
      expect(page.at).toBeGreaterThan(fill.at);
    });

    it("applies no palette class without a color or emphasis", () => {
      render(<Text>Plain</Text>);
      const el = screen.getByText("Plain");
      expect(el).not.toHaveAttribute("data-ui-emphasis");
      expect(el.className).not.toMatch(/palette-/);
    });

    it("writes a bare attribute for a toggle that is on", () => {
      render(
        <Text strikethrough uppercase balance nowrap truncate underline>
          Toggles
        </Text>,
      );
      const el = screen.getByText("Toggles");
      for (const key of [
        "strikethrough",
        "uppercase",
        "balance",
        "nowrap",
        "truncate",
        "underline",
      ]) {
        expect(el).toHaveAttribute(`data-ui-${key}`, "");
      }
    });

    it("writes nothing for a toggle that is off", () => {
      render(
        <Text
          strikethrough={false}
          uppercase={false}
          balance={false}
          nowrap={false}
          truncate={false}
          underline={false}
        >
          Off
        </Text>,
      );
      const el = screen.getByText("Off");
      for (const key of [
        "strikethrough",
        "uppercase",
        "balance",
        "nowrap",
        "truncate",
        "underline",
      ]) {
        expect(el).not.toHaveAttribute(`data-ui-${key}`);
      }
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

    it("keeps the render element's own title when Text has none", () => {
      render(
        <Text render={<abbr title="HyperText Markup Language" />}>HTML</Text>,
      );
      const el = screen.getByText("HTML");
      expect(el.tagName).toBe("ABBR");
      expect(el).toHaveAttribute("title", "HyperText Markup Language");
    });

    it("lets Text's title win over the render element's", () => {
      render(
        <Text title="From Text" render={<abbr title="From render" />}>
          Explicit
        </Text>,
      );
      expect(screen.getByText("Explicit")).toHaveAttribute(
        "title",
        "From Text",
      );
    });

    it("lets a derived truncate title win over the render element's", () => {
      render(
        <Text truncate render={<abbr title="From render" />}>
          Clipped
        </Text>,
      );
      expect(screen.getByText("Clipped")).toHaveAttribute("title", "Clipped");
    });
  });

  // ============================================
  // NESTED EXAMPLE
  // ============================================
  // The Nested example is the visual proof that a nested Text inherits. The
  // attribute half is pinned here: each inner span names only the prop it
  // demonstrates, so the CSS has nothing but inheritance to paint from.

  describe("Nested example", () => {
    it("names only the prop each inner span demonstrates", () => {
      render(<Examples.Nested />);
      for (const word of ["bold", "mono", "colored"]) {
        expect(screen.getByText(word)).not.toHaveAttribute("data-ui-size");
      }
      const bold = screen.getByText("bold");
      expect(bold).toHaveAttribute("data-ui-weight", "bold");
      expect(bold).not.toHaveAttribute("data-ui-family");
      expect(screen.getByText("mono")).toHaveAttribute(
        "data-ui-family",
        "mono",
      );
      const colored = screen.getByText("colored");
      expect(colored).toHaveAttribute("data-ui-color");
      expect(colored).not.toHaveAttribute("data-ui-family");
    });

    it("writes the explicit size that resets inside a larger sentence", () => {
      render(<Examples.Nested />);
      const el = screen.getByText("resets");
      expect(el).toHaveAttribute("data-ui-size", "0");
      expect(el).not.toHaveAttribute("data-ui-family");
    });
  });
});
