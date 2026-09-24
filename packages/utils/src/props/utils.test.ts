import { describe, it, expect } from "vitest";

import { prepareComponentProps } from "./utils";

describe("prepareComponentProps", () => {
  it("stamps data-slot with the component name", () => {
    const result = prepareComponentProps({ componentName: "box", props: {} });

    expect(result).toHaveProperty("data-slot", "box");
    expect(result).not.toHaveProperty("style");
  });

  it("multiplies unit props by their spacing variable", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { gap: 2, px: 4 },
      styleProps: ["gap", "px"],
    });

    expect(result.style).toEqual({
      gap: "calc(2 * var(--spacing-unit))",
      paddingInline: "calc(4 * var(--spacing-inline))",
    });
  });

  it("writes unitless numbers as px and strings verbatim", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { w: 240, ax: "space-between" },
      styleProps: ["w", "ax"],
    });

    expect(result.style).toEqual({
      width: "240px",
      justifyContent: "space-between",
    });
  });

  it("only converts the style props it is given", () => {
    const result = prepareComponentProps({
      componentName: "text",
      props: { p: 2, gap: 4 },
      styleProps: ["p"],
    });

    expect(result.style).toEqual({ padding: "calc(2 * var(--spacing-unit))" });
    expect(result).toHaveProperty("gap", 4);
  });

  it("skips undefined and null style props", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { p: undefined, m: null },
      styleProps: ["p", "m"],
    });

    expect(result).not.toHaveProperty("style");
  });

  it("lets the caller's style win over style props", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { p: 2, style: { padding: "1px", color: "red" } },
      styleProps: ["p"],
    });

    expect(result.style).toEqual({ padding: "1px", color: "red" });
  });

  it("passes other props through untouched", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { id: "a", "aria-label": "b" },
    });

    expect(result).toMatchObject({ id: "a", "aria-label": "b" });
  });
});
