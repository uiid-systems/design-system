import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";

import type { TextProps } from "./text.types";

import "@uiid/utils/bold.css";
import "@uiid/utils/center.css";

import styles from "./text.module.css";

export const Text = ({
  level,
  shade,
  render,
  children,
  ...props
}: TextProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "text",
    toggleProps: ["bold", "center"],
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
      level,
      shade,
      className: cx(styles.text, props.className),
    },
    render,
    children,
  });
};
