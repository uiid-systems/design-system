import type { Collapsible } from "@base-ui/react/collapsible";

import type {
  CardProps,
  CardTitleProps,
  InnerContainerProps,
} from "../card/card.types";

type CollapsibleRootProps = Pick<
  Collapsible.Root.Props,
  "open" | "defaultOpen" | "onOpenChange" | "disabled"
>;

export type CollapsibleCardProps = Omit<
  CardProps,
  "title" | "TitleProps" | "InnerContainerProps"
> &
  CollapsibleRootProps & {
    /**
     * Required: it is what a collapsed card still shows, and it names the
     * chevron trigger for assistive technology.
     */
    title: React.ReactNode;
    /** Presentation only; the title's content always comes from `title`. */
    TitleProps?: Omit<CardTitleProps, "children">;
    /** The body is the collapsible panel, so its `render` target is fixed. */
    InnerContainerProps?: Omit<InnerContainerProps, "render">;
  };
