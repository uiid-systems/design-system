import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";

import type { BoxProps } from "./box.types";
import { boxVariants } from "./box.variants";
import styles from "./box.module.css";

export const Box = ({
  evenly,
  fullwidth,
  fullheight,
  fullscreen,
  render,
  className,
  children,
  ...props
}: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    styleProps: [
      "ax",
      "ay",
      "b",
      "bb",
      "bl",
      "br",
      "bt",
      "bx",
      "by",
      "direction",
      "gap",
      "m",
      "mx",
      "my",
      "ml",
      "mr",
      "mt",
      "mb",
      "p",
      "px",
      "py",
      "pl",
      "pr",
      "pt",
      "pb",
    ],
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: {
      ...preparedProps,
      className: cx(
        styles["box"],
        boxVariants({
          evenly,
          fullwidth,
          fullheight,
          fullscreen,
        }),
        className,
      ),
    },
    render,
    children,
  });
};
Box.displayName = "Box";
