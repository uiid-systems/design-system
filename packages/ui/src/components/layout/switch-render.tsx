import { cloneElement } from "react";

export interface SwitchRenderProps {
  condition: boolean;
  wrappers: {
    true: React.ReactElement<unknown>;
    false: React.ReactElement<unknown>;
  };
  children?: React.ReactNode;
}

export function SwitchRender({
  condition,
  wrappers,
  children,
}: SwitchRenderProps) {
  const selectedWrapper = condition ? wrappers.true : wrappers.false;
  if (!selectedWrapper) return <>{children}</>;
  const contentToRender =
    children ?? (selectedWrapper.props as React.PropsWithChildren).children;
  return cloneElement(selectedWrapper, undefined, contentToRender);
}
SwitchRender.displayName = "SwitchRender";
