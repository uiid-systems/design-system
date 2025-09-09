import { prepareComponentProps, renderWithProps } from "../../../utils";
import type { TextProps } from "./text.types";

import "@uiid/tokens/primitives/typography.css";
import "./text.styles.css";

export const Text = ({ level, render, children, ...props }: TextProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "text",
    props,
  });

  return renderWithProps({
    fallbackElement: "span",
    props: { ...preparedProps, level },
    render,
    children,
  });
};
