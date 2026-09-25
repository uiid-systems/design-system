import { paletteColorStyles } from "@uiid/tokens";
import {
  prepareComponentProps,
  renderWithProps,
  cx,
  marginPropKeys,
  paddingPropKeys,
} from "@uiid/utils";

import { TEXT_DEFAULT_SIZE, TEXT_DEFAULT_FAMILY } from "./text.constants";
import type { TextProps } from "./text.types";

import styles from "./text.module.css";

/** A toggle that is on writes a bare attribute; off writes nothing. */
const toggle = (on: boolean | undefined) => (on ? "" : undefined);

export const Text = ({
  shade,
  color,
  weight,
  underline,
  strikethrough,
  balance,
  truncate,
  title,
  size = TEXT_DEFAULT_SIZE,
  family = TEXT_DEFAULT_FAMILY,
  render,
  className,
  children,
  ...props
}: TextProps) => {
  // When truncated, expose the full text as a native tooltip so clipped content
  // stays readable on hover. Only derivable from string/number children; an
  // explicit title always wins.
  const resolvedTitle =
    title ??
    (truncate && (typeof children === "string" || typeof children === "number")
      ? String(children)
      : undefined);

  const preparedProps = prepareComponentProps({
    componentName: "text",
    styleProps: [...paddingPropKeys, ...marginPropKeys],
    props,
  });

  return renderWithProps({
    fallbackElement: "span",
    props: {
      ...preparedProps,
      "data-ui-size": size,
      "data-ui-weight": weight,
      "data-ui-family": family,
      "data-ui-shade": shade,
      // The hue's `--palette-*` names ride on the tokens class; the attribute
      // is what paints from them.
      "data-ui-color": color,
      "data-ui-underline": underline === false ? "false" : toggle(underline),
      "data-ui-strikethrough": toggle(strikethrough),
      "data-ui-balance": toggle(balance),
      "data-ui-truncate": toggle(truncate),
      title: resolvedTitle,
      className: cx(
        styles["text"],
        color && paletteColorStyles[color],
        className,
      ),
    },
    render,
    children,
  });
};
