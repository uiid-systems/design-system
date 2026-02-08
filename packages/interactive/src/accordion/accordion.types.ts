import type { Accordion } from "@base-ui/react/accordion";
import type { CardProps } from "@uiid/cards";

import type { Icon } from "@uiid/icons";

export type AccordionItemData = {
  value: string;
  icon?: Icon;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionRootProps = Accordion.Root.Props & CardProps;
export type AccordionItemProps = Accordion.Item.Props;
export type AccordionHeaderProps = Accordion.Header.Props;
export type AccordionTriggerProps = Accordion.Trigger.Props &
  Pick<AccordionItemData, "icon">;
export type AccordionPanelProps = Accordion.Panel.Props;

export type AccordionProps = {
  items: AccordionItemData[];
  RootProps?: AccordionRootProps;
  ItemProps?: Omit<AccordionItemProps, "value" | "disabled">;
  HeaderProps?: AccordionHeaderProps;
  TriggerProps?: AccordionTriggerProps;
  PanelProps?: AccordionPanelProps;
} & Pick<
  AccordionRootProps,
  | "defaultValue"
  | "value"
  | "onValueChange"
  | "disabled"
  | "orientation"
  | "multiple"
  | "fullwidth"
>;
