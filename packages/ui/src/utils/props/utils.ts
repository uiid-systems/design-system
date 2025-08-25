import React from "react";
import { type ToggleProps } from "./types";
import { styleProps } from "./styles";

export type PrepareComponentPropsOptions<T extends Record<string, unknown>> = {
  componentName: string;
  props: T;
  toggleProps?: (keyof ToggleProps)[];
  styleProps?: (keyof typeof styleProps)[];
};

/**
 * Utility function to prepare props for components with toggles, style props, and data attributes.
 * Automatically handles toggle props (creates data attributes) and style props (creates inline styles).
 *
 * @example
 * ```ts
 * const preparedProps = prepareComponentProps({
 *   componentName: "box",
 *   props: { evenly: true, fullwidth: false, ax: "center", className: "my-class" },
 *   toggleProps: ["evenly", "fullwidth"],
 *   styleProps: ["ax", "ay"]
 * });
 * // Result: {
 * //   "uiid": "box",
 * //   "evenly": "true",
 * //   "ax": "center",
 * //   style: { justifyContent: "center" },
 * //   className: "my-class"
 * // }
 * ```
 */
export function prepareComponentProps<T extends Record<string, unknown>>({
  componentName,
  props,
  toggleProps = [],
  styleProps: stylePropKeys = [],
}: PrepareComponentPropsOptions<T>) {
  const dataAttrs: Record<string, string> = {
    uiid: componentName,
  };

  const restProps: Record<string, unknown> = {};
  const styleObj: React.CSSProperties = {};

  for (const [key, value] of Object.entries(props)) {
    if (
      toggleProps.includes(key as keyof ToggleProps) &&
      typeof value === "boolean"
    ) {
      // Convert toggle props to data attributes (only set if true)
      if (value) {
        dataAttrs[`${key}`] = "true";
      }
    } else if (
      stylePropKeys.includes(key as keyof typeof styleProps) &&
      value !== undefined
    ) {
      // Convert style props to CSS properties
      const styleProp = styleProps[key as keyof typeof styleProps];
      if (styleProp && value != null) {
        // Check if the style prop has a scale configuration
        if (
          "scale" in styleProp &&
          styleProp.scale &&
          typeof value === "number"
        ) {
          // Compose value with scale variable using calc()
          const unit =
            "unit" in styleProp.scale ? styleProp.scale.unit || "" : "";
          (styleObj as Record<string, unknown>)[styleProp.property] =
            `calc(${value} * var(${styleProp.scale.variable}))${unit}`;
        } else {
          // Apply value directly for non-scaled props
          (styleObj as Record<string, unknown>)[styleProp.property] = value;
        }
        // Also add data attribute for dev tools visibility
        dataAttrs[`${key}`] = String(value);
      }
    } else {
      // Keep all other props as-is
      restProps[key] = value;
    }
  }

  // Merge generated styles with any existing style prop
  const finalStyle =
    Object.keys(styleObj).length > 0
      ? { ...styleObj, ...((restProps.style as React.CSSProperties) || {}) }
      : (restProps.style as React.CSSProperties);

  return {
    ...dataAttrs,
    ...restProps,
    ...(finalStyle && { style: finalStyle }),
  };
}
