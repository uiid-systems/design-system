import type { Accordion } from "@base-ui/react/accordion";
import type { CardProps } from "@uiid/cards";
import type { Icon } from "@uiid/icons";
import type { StackProps } from "@uiid/layout";
import type { VariantProps, WithLayoutProps } from "@uiid/utils";

import type {
  accordionRootVariants,
  accordionTriggerVariants,
} from "./accordion.variants";

export type AccordionItemData = {
  value: string;
  icon?: Icon;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionRootVariants = VariantProps<typeof accordionRootVariants>;
export type AccordionTriggerVariants = VariantProps<
  typeof accordionTriggerVariants
>;

/*
 * `variant` joins Base UI's props on the left so Accordion's own surface
 * treatment wins over `Card`'s. The root consumes it and never passes it on.
 */
export type AccordionRootProps = WithLayoutProps<
  Accordion.Root.Props & AccordionRootVariants,
  CardProps
>;
export type AccordionItemProps = WithLayoutProps<
  Accordion.Item.Props,
  StackProps
>;
export type AccordionHeaderProps = Accordion.Header.Props;
export type AccordionTriggerProps = Accordion.Trigger.Props &
  Pick<AccordionItemData, "icon"> &
  AccordionTriggerVariants;
export type AccordionPanelProps = Accordion.Panel.Props &
  AccordionTriggerVariants;
export type AccordionContentProps = StackProps;

export type AccordionProps = {
  items: AccordionItemData[];
  RootProps?: AccordionRootProps;
  ItemProps?: Omit<AccordionItemProps, "value" | "disabled">;
  HeaderProps?: AccordionHeaderProps;
  TriggerProps?: AccordionTriggerProps;
  PanelProps?: AccordionPanelProps;
  ContentProps?: AccordionContentProps;
} & Pick<
  AccordionRootProps,
  | "defaultValue"
  | "value"
  | "onValueChange"
  | "disabled"
  | "orientation"
  | "multiple"
  | "fullwidth"
  | "variant"
> &
  AccordionTriggerVariants;
