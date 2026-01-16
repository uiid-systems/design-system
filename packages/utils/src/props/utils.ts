import { styleProps } from "./styles";

export type PrepareComponentPropsOptions<T extends Record<string, unknown>> = {
  componentName: string;
  props: T;
  styleProps?: (keyof typeof styleProps)[];
};

/**
 * Utility function to prepare props for components with toggles, style props, and data attributes.
 * Automatically handles toggle props (creates data attributes) and style props (creates inline styles).
 */
export function prepareComponentProps<T extends Record<string, unknown>>({
  componentName,
  props,
  styleProps: stylePropKeys = [],
}: PrepareComponentPropsOptions<T>) {
  const dataAttrs: Record<string, string> = {
    "data-slot": componentName,
  };

  const restProps: Record<string, unknown> = {};
  const styleObj: React.CSSProperties = {};

  for (const [key, value] of Object.entries(props)) {
    if (
      stylePropKeys.includes(key as keyof typeof styleProps) &&
      value !== undefined
    ) {
      const styleProp = styleProps[key as keyof typeof styleProps];
      if (styleProp && value != null) {
        if (
          "scale" in styleProp &&
          styleProp.scale &&
          typeof value === "number"
        ) {
          const unit =
            "unit" in styleProp.scale ? styleProp.scale.unit || "" : "";
          const calcValue = `calc(${value} * var(${styleProp.scale.variable}))${unit}`;
          (styleObj as Record<string, unknown>)[styleProp.property] = calcValue;
        } else {
          (styleObj as Record<string, unknown>)[styleProp.property] = value;
        }
        dataAttrs[`${key}`] = String(value);
      }
    } else {
      restProps[key] = value;
    }
  }

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
