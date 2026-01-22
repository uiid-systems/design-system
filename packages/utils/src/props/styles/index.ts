import * as border from "./border";
import * as layout from "./layout";
import * as spacing from "./spacing";

export const styleProps = {
  ...border,
  ...layout,
  ...spacing,
};

export type { BorderProps } from "./border";
export type { LayoutProps } from "./layout";
export type { SpacingProps } from "./spacing";
