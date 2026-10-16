import { borderProps } from "./border";
import { keysOf } from "./keys";
import { layoutProps } from "./layout";
import { sizingProps } from "./sizing";
import { spacingProps } from "./spacing";

export const styleProps = {
  ...borderProps,
  ...layoutProps,
  ...spacingProps,
  ...sizingProps,
};

export const stylePropKeys = keysOf(styleProps);

export { borderPropKeys, type BorderProps } from "./border";
export { layoutPropKeys, type LayoutProps } from "./layout";
export { spacingPropKeys, type SpacingProps } from "./spacing";
export { sizingPropKeys, type SizingProps } from "./sizing";
export {
  toggleProps,
  togglePropKeys,
  type ToggleProp,
  type ToggleProps,
} from "./toggles";
