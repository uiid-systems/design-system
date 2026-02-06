import * as border from "./border";
import * as layout from "./layout";
import * as spacing from "./spacing";
import * as sizing from "./sizing";

export const styleProps = {
  ...border,
  ...layout,
  ...spacing,
  ...sizing,
};

export const stylePropKeys = Object.keys(
  styleProps,
) as (keyof typeof styleProps)[];

export type { BorderProps } from "./border";
export type { LayoutProps } from "./layout";
export type { SpacingProps } from "./spacing";
export type { SizingProps } from "./sizing";
