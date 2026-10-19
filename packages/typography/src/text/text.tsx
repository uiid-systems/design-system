import { paletteColorStyles } from "@uiid/tokens";
import {
  prepareComponentProps,
  renderWithProps,
  cx,
  spacingPropKeys,
} from "@uiid/utils";

import type { TextProps } from "./text.types";

import styles from "./text.module.css";

/** Text's own vocabulary, each written as `data-ui-{key}` for text.module.css. */
const textDataPropKeys = [
  "size",
  "weight",
  "family",
  "shade",
  "color",
  "emphasis",
  "strikethrough",
  "uppercase",
  "balance",
  "nowrap",
  "truncate",
  "underline",
] as const;

export const Text = ({
  title,
  render,
  className,
  children,
  ...props
}: TextProps) => {
  // Read here, but left in `props` so they also reach `dataProps`.
  const { color, emphasis, truncate } = props;

  // When truncated, expose the full text as a native tooltip so clipped content
  // stays readable on hover. Only derivable from string/number children; an
  // explicit title always wins.
  const resolvedTitle =
    title ??
    (truncate && (typeof children === "string" || typeof children === "number")
      ? String(children)
      : undefined);

  // An emphasis reads the --palette-* names, so it needs a hue to read them
  // from even when no color is set. The hue's `--palette-*` names ride on the
  // tokens class; the data-ui-color attribute is what paints from them.
  const palette = color ?? (emphasis ? "neutral" : undefined);

  const preparedProps = prepareComponentProps({
    componentName: "text",
    styleProps: spacingPropKeys,
    dataProps: textDataPropKeys,
    props,
  });

  return renderWithProps({
    fallbackElement: "span",
    props: {
      ...preparedProps,
      title: resolvedTitle,
      className: cx(
        styles["text"],
        palette && paletteColorStyles[palette],
        className,
      ),
    },
    render,
    children,
  });
};
