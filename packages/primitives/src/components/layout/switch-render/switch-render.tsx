import { cloneElement } from "react";

import type { SwitchRenderProps } from "./switch-render.types";

export const SwitchRender = ({
  condition,
  wrappers,
  children,
}: SwitchRenderProps) => {
  const selectedWrapper = condition ? wrappers.true : wrappers.false;

  if (!selectedWrapper) return <>{children}</>;

  const contentToRender =
    children ?? (selectedWrapper.props as React.PropsWithChildren).children;

  return cloneElement(selectedWrapper, undefined, contentToRender);
};
SwitchRender.displayName = "SwitchRender";
