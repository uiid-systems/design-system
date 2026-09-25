import { describe, it, expect } from "vitest";

import { prepareComponentProps } from "./utils";

describe("prepareComponentProps", () => {
  it("stamps data-slot with the component name", () => {
    const result = prepareComponentProps({ componentName: "box", props: {} });

    expect(result).toHaveProperty("data-slot", "box");
    expect(result).not.toHaveProperty("style");
  });

  it("writes a style prop as a data attribute and a raw var", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { gap: 2, ax: "space-between" },
      styleProps: ["gap", "ax"],
    });

    expect(result).toHaveProperty("data-ui-gap", "2");
    expect(result).toHaveProperty("data-ui-ax", "space-between");
    expect(result.style).toEqual({
      "--props-gap": 2,
      "--props-ax": "space-between",
    });
  });

  it("writes one pair per breakpoint a responsive value sets", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { gap: { base: 2, sm: 6 } },
      styleProps: ["gap"],
    });

    expect(result).toHaveProperty("data-ui-gap", "2");
    expect(result).toHaveProperty("data-ui-gap-sm", "6");
    expect(result.style).toEqual({ "--props-gap": 2, "--props-gap-sm": 6 });
  });

  it("only converts the style props it is given", () => {
    const result = prepareComponentProps({
      componentName: "text",
      props: { p: 2, gap: 4 },
      styleProps: ["p"],
    });

    expect(result).toHaveProperty("data-ui-p", "2");
    expect(result).not.toHaveProperty("data-ui-gap");
    expect(result).toHaveProperty("gap", 4);
  });

  it("skips undefined and null style props", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { p: undefined, m: null },
      styleProps: ["p", "m"],
    });

    expect(result).not.toHaveProperty("data-ui-p");
    expect(result).not.toHaveProperty("data-ui-m");
    expect(result).not.toHaveProperty("style");
  });

  it("writes a bare attribute for a toggle that is on, and nothing when off", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { fullwidth: true, evenly: false },
      toggleProps: ["fullwidth", "evenly"],
    });

    expect(result).toHaveProperty("data-ui-fullwidth", "");
    expect(result).not.toHaveProperty("data-ui-evenly");
    expect(result).not.toHaveProperty("fullwidth");
    expect(result).not.toHaveProperty("evenly");
  });

  it("keeps the caller's style, which wins over style props", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { p: 2, style: { padding: "1px", color: "red" } },
      styleProps: ["p"],
    });

    expect(result.style).toEqual({
      "--props-p": 2,
      padding: "1px",
      color: "red",
    });
  });

  it("passes other props through untouched", () => {
    const result = prepareComponentProps({
      componentName: "box",
      props: { id: "a", "aria-label": "b" },
    });

    expect(result).toMatchObject({ id: "a", "aria-label": "b" });
  });
});
