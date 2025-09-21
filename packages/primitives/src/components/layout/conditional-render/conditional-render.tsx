import { cloneElement } from "react";

export type ConditionalRenderProps = {
  condition: boolean;
  wrapper: React.ReactElement<unknown>;
  children?: React.ReactNode;
};

export function ConditionalRender({
  condition,
  wrapper,
  children,
}: ConditionalRenderProps) {
  if (!condition || !wrapper) return <>{children}</>;

  const contentToRender =
    children ?? (wrapper.props as React.PropsWithChildren).children;

  return cloneElement(wrapper, undefined, contentToRender);
}
ConditionalRender.displayName = "ConditionalRender";
