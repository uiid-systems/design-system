import { describe, expect, expectTypeOf, it } from "vitest";

import * as utils from "./index";

// @uiid/utils serves the sibling @uiid/* packages, so its barrel holds the
// names some other package imports and nothing else. Apps reach `cx` through
// `@uiid/design-system/utils`.
describe("@uiid/utils barrel", () => {
  it("exports exactly the runtime names other packages import", () => {
    expect(Object.keys(utils).sort()).toEqual([
      "cva",
      "cx",
      "cxState", // UI-465 removes it
      "definedProps",
      "hasTrigger",
      "isRenderable",
      "prepareComponentProps",
      "renderWithProps",
      "resolveRender",
      "resolveStyleProp",
      "resolveTrigger",
      "spacingPropKeys",
      "splitDomAttributes",
      "stylePropKeys",
      "togglePropKeys",
      "useComposedRefs",
    ]);
  });

  it("exports the types other packages import", () => {
    expectTypeOf<utils.VariantProps<() => string>>().toBeObject();
    expectTypeOf<utils.RenderProp>().not.toBeNever();
    expectTypeOf<utils.BorderProps>().toBeObject();
    expectTypeOf<utils.LayoutProps>().toBeObject();
    expectTypeOf<utils.SpacingProps>().toBeObject();
    expectTypeOf<utils.SizingProps>().toBeObject();
    expectTypeOf<utils.ToggleProps>().toBeObject();
    expectTypeOf<utils.DomAttributes>().toBeObject();
    expectTypeOf<utils.WithLayoutProps<object, object>>().toBeObject();
    expectTypeOf<utils.WithTriggerChildren<object, object>>().toBeObject();
  });

  it("keeps the option, definition and trigger-children types internal", () => {
    // Type-only exports are invisible to the runtime check above.
    // @ts-expect-error internal to @uiid/utils
    expectTypeOf<utils.PrepareComponentPropsOptions<object>>();
    // @ts-expect-error internal to @uiid/utils
    expectTypeOf<utils.RenderWithPropsOptions<object>>();
    // @ts-expect-error internal to @uiid/utils
    expectTypeOf<utils.StyleProp<"gap">>();
    // @ts-expect-error internal to @uiid/utils
    expectTypeOf<utils.ToggleProp>();
    // @ts-expect-error internal to @uiid/utils
    expectTypeOf<utils.TriggerChildren<object>>();
  });
});
