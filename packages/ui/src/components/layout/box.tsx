import {
  type RenderProp,
  type ToggleProps,
  type LayoutProps,
  renderWithProps,
  prepareComponentProps,
} from "../../core";

import "../../core/props/toggles/evenly.css";
import "../../core/props/toggles/fullwidth.css";

export type BoxProps = React.PropsWithChildren<{
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}> &
  ToggleProps &
  LayoutProps;

export const Box = ({ render, children, ...props }: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    toggleProps: ["evenly", "fullwidth"],
    styleProps: ["ax", "ay"],
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: preparedProps,
    render,
    children,
  });
};
Box.displayName = "Box";
