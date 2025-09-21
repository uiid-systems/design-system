import type { RenderProp } from "./utils/render";

export type UiProps = {
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  uiid?: string;
};
