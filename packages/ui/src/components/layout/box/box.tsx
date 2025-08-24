import {
  type RenderProp,
  type ToggleProps,
  type LayoutProps,
  type SpacingProps,
  renderWithProps,
  prepareComponentProps,
} from "../../../utils";

import "../../../utils/props/toggles/evenly.css";
import "../../../utils/props/toggles/fullwidth.css";

export type BoxProps = React.PropsWithChildren<{
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  uiid?: string;
}> &
  ToggleProps &
  LayoutProps &
  SpacingProps;

export const Box = ({ render, children, ...props }: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    toggleProps: ["evenly", "fullwidth"],
    styleProps: [
      "ax",
      "ay",
      "direction",
      "gap",
      "m",
      "mx",
      "my",
      "ml",
      "mr",
      "mt",
      "mb",
      "p",
      "px",
      "py",
      "pl",
      "pr",
      "pt",
      "pb",
    ],
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
