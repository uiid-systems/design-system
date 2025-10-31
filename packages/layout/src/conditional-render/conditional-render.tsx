import { cloneElement } from "react";

import type { ConditionalRenderProps } from "./conditional-render.types";

export function ConditionalRender({
  condition,
  render,
  children,
}: ConditionalRenderProps) {
  if (!condition || !render) return <>{children}</>;

  const contentToRender =
    children ?? (render.props as React.PropsWithChildren).children;

  return cloneElement(render, undefined, contentToRender);
}
ConditionalRender.displayName = "ConditionalRender";
