import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";

import type { TextProps } from "./text.types";

import { textVariants } from "./text.variants";
import styles from "./text.module.css";

export const Text = ({
  shade,
  size,
  tone,
  underline,
  weight,
  strikethrough,
  render,
  className,
  children,
  ...props
}: TextProps) => {
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
      className: cx(
        styles["text"],
        textVariants({
          shade,
          size,
          tone,
          weight,
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
