import type { ToggleProps, LayoutProps, SpacingProps } from "@uiid/utils";
import type { UiProps } from "../../../types";

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLDivElement>;
} & UiProps &
  ToggleProps &
  LayoutProps &
  SpacingProps;
