import {
  prepareComponentProps,
  renderWithProps,
  cx,
  stylePropKeys,
} from "@uiid/utils";

import type { BoxProps } from "./box.types";
import { boxVariants } from "./box.variants";
import styles from "./box.module.css";

export const Box = ({
  bordered,
  evenly,
  fullwidth,
  fullheight,
  fullscreen,
  rounded,
  square,
  render,
  className,
  children,
  ...props
}: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    styleProps: stylePropKeys,
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: {
      ...preparedProps,
      className: cx(
        styles["box"],
        boxVariants({
          bordered,
          evenly,
          fullwidth,
          fullheight,
          fullscreen,
          rounded,
          square,
        }),
        className,
      ),
    },
    render,
    children,
  });
};
Box.displayName = "Box";
