import type { SpacingProps, RenderProp } from "@uiid/utils";

export type ProseProps = React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren<{
    /** Ref to the underlying element */
    ref?: React.Ref<HTMLDivElement>;
    /** Replace the rendered element, e.g. `render={<article />}` */
    render?: RenderProp;
    /** Inline styles merged onto the element */
    style?: React.CSSProperties;
    /** Class names merged onto the element */
    className?: string;
  }> &
  SpacingProps;
