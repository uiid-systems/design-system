import {
  prepareComponentProps,
  renderWithProps,
  cx,
  stylePropKeys,
  togglePropKeys,
} from "@uiid/utils";

import type { BoxProps } from "./box.types";

import styles from "./box.module.css";

export const Box = ({ render, className, children, ...props }: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    styleProps: stylePropKeys,
    toggleProps: [...togglePropKeys],
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: {
      ...preparedProps,
      className: cx(styles["box"], className),
    },
    render,
    children,
  });
};
Box.displayName = "Box";
