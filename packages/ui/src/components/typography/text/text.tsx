import type { UiProps } from "../../../types";
import { prepareComponentProps, renderWithProps } from "../../../utils";

import "@uiid/tokens/primitives/typography.css";
import "./text.styles.css";

export type TextProps = React.PropsWithChildren<{
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  ref?: React.Ref<HTMLSpanElement>;
}> &
  UiProps;

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
