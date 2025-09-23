import { prepareComponentProps, renderWithProps, cx } from "../../../utils";
import type { TextProps } from "./text.types";

import styles from "./text.module.css";

export const Text = ({ level, render, children, ...props }: TextProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "text",
    props,
  });

  return renderWithProps({
    fallbackElement: "span",
    props: {
      ...preparedProps,
      level,
      className: cx(styles.text, props.className),
    },
    render,
    children,
  });
};
