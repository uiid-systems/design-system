import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";
import type { TextProps } from "./text.types";

import "./bold.css";
import styles from "./text.module.css";

export const Text = ({ level, render, children, ...props }: TextProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "text",
    toggleProps: ["bold"],
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
