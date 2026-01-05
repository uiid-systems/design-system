import { prepareComponentProps, renderWithProps, cx } from "@uiid/utils";

import type { TextProps } from "./text.types";

import { textVariants } from "./text.variants";
import styles from "./text.module.css";
import { TEXT_DEFAULT_SIZE } from "./text.constants";

export const Text = ({
  shade,
  size = TEXT_DEFAULT_SIZE,
  tone,
  underline,
  weight,
  align,
  strikethrough,
  balance,
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
          align,
          weight,
          balance,
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
