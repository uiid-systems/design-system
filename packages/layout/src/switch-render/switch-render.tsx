import { cloneElement } from "react";

import type { SwitchRenderProps } from "./switch-render.types";

export const SwitchRender = ({
  condition,
  render,
  children,
  ...additionalProps
}: SwitchRenderProps) => {
  const selectedWrapper = condition ? render.true : render.false;

  if (!selectedWrapper) return <>{children}</>;

  const contentToRender =
    children ?? (selectedWrapper.props as React.PropsWithChildren).children;

  return cloneElement(selectedWrapper, additionalProps, contentToRender);
};
SwitchRender.displayName = "SwitchRender";
