import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";

import type { TextProps } from "./text.types";

import { textVariants } from "./text.variants";
import styles from "./text.module.css";
import { TEXT_DEFAULT_SIZE, TEXT_DEFAULT_FAMILY } from "./text.constants";

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
    styleProps: [
      "p",
      "px",
      "py",
      "pl",
      "pr",
      "pt",
      "pb",
      "m",
      "mx",
      "my",
      "ml",
      "mr",
      "mt",
      "mb",
    ],
    props,
  });

  return renderWithProps({
    fallbackElement: "span",
    props: {
      ...preparedProps,
      title: resolvedTitle,
      className: cx(
        styles["text"],
        textVariants({
          shade,
          color,
          size,
          weight,
          family,
          balance,
          truncate,
          underline,
          strikethrough,
        }),
        className,
      ),
    },
    render,
    children,
  });
};
