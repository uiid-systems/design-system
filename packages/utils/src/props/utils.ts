import type { styleProps } from "./styles";

export type PrepareComponentPropsOptions<T extends Record<string, unknown>> = {
  componentName: string;
  props: T;
  styleProps?: (keyof typeof styleProps)[];
};

/**
 * Stamps `data-slot`, and puts each listed style prop on the element as
 * `data-ui-{key}` plus a raw `--props-{key}` for the rules in
 * `@uiid/tokens/props.css` to resolve. A caller's own `style` still wins.
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
      if (value != null) {
        dataAttrs[`data-ui-${key}`] = String(value);
        (styleObj as Record<string, unknown>)[`--props-${key}`] = value;
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

/**
 * DOM attributes a caller can put on a component without the props type
 * declaring them. `AriaAttributes` types every `aria-*` key exactly; the
 * template index signature covers `data-*` hooks.
 */
export type DomAttributes = React.AriaAttributes &
  Record<`data-${string}`, string | undefined>;

/**
 * Splits leftover props into the DOM attributes a headless Root would swallow
 * and everything else.
 *
 * Base UI's `Root` parts group state and render no element, so an `aria-label`
 * or `data-*` spread onto one reaches no DOM at all — the only signal is the
 * absence of whatever it was meant to do. TypeScript cannot catch it either:
 * JSX exempts hyphenated attribute names from excess-property checks, so
 * `aria-label` compiles against a Root props interface that has no such key.
 *
 * The hyphen is the whole test. No Base UI Root prop contains one, so anything
 * hyphenated is a DOM attribute meant for the element the caller can see —
 * the focusable control, not the wrapper that renders nothing.
 */
export function splitDomAttributes<T extends Record<string, unknown>>(
  props: T,
) {
  const domAttributes: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    (key.includes("-") ? domAttributes : rest)[key] = value;
  }

  return [domAttributes as DomAttributes, rest as T] as const;
}
