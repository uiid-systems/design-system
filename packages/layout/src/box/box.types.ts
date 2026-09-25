import type {
  BorderProps,
  LayoutProps,
  SpacingProps,
  SizingProps,
  RenderProp,
  ToggleProps,
} from "@uiid/utils";

type StyleProps = BorderProps & LayoutProps & SpacingProps & SizingProps;

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  /** Ref to the underlying element */
  ref?: React.Ref<HTMLDivElement>;
  /** Replace the rendered element, e.g. `render={<section />}` */
  render?: RenderProp;
  /** Inline styles merged onto the element */
  style?: React.CSSProperties;
  /** Class names merged onto the element */
  className?: string;
} & StyleProps &
  ToggleProps;
