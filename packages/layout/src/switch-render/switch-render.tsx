import { renderWithProps, type RenderProp } from "@uiid/utils";

import type { SwitchRenderProps } from "./switch-render.types";

export const SwitchRender = ({
  condition,
  render,
  children,
  ...additionalProps
}: SwitchRenderProps) => {
  const selectedWrapper = condition ? render.true : render.false;

  if (!selectedWrapper) return <>{children}</>;

  return renderWithProps({
    render: selectedWrapper as RenderProp,
    children,
    props: additionalProps,
  });
};
SwitchRender.displayName = "SwitchRender";
