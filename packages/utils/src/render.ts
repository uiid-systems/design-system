import { cloneElement, isValidElement, createElement } from "react";
import { cx } from "./cva";

export type RenderProp = React.ReactElement<
  React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
  }>
>;

export type RenderWithPropsOptions = {
  render?: RenderProp;
  children?: React.ReactNode;
  props: Record<string, unknown>;
  fallbackElement?: keyof React.JSX.IntrinsicElements;
};

/**
 * Utility function to handle render prop logic with prop merging, className merging, and style merging.
 * This abstracts the common pattern of cloning elements with merged props.
 */
export const renderWithProps = ({
  render,
  children,
  props,
  fallbackElement = "div",
}: RenderWithPropsOptions): React.ReactElement => {
  if (isValidElement(render)) {
    return cloneElement(render, {
      ...props,
      children: children ?? render.props.children,
      className: cx(render.props.className, props.className as string),
      style: {
        ...render.props.style,
        ...(props.style as React.CSSProperties),
      },
    });
  }

  return createElement(fallbackElement, props, children);
};
