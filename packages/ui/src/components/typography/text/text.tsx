import {
  type RenderProp,
  prepareComponentProps,
  renderWithProps,
} from "../../../utils";

import "@uiid/tokens/typography/text.css";
import "./text.styles.css";

export type TextProps = React.PropsWithChildren<{
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  uiid?: string;
}>;

export const Text = ({ level, render, children, ...props }: TextProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "text",
    props,
  });

  // Add level as an HTML attribute if provided
  // const finalProps =
  //   level !== undefined
  //     ? { ...preparedProps, level: String(level) }
  //     : preparedProps;

  return renderWithProps({
    fallbackElement: "span",
    props: { ...preparedProps, level },
    render,
    children,
  });
};
