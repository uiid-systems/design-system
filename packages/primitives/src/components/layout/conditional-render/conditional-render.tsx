import { cloneElement } from "react";

import type { ConditionalRenderProps } from "./conditional-render.types";

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
