import { definedProps } from "@uiid/utils";

import type { AccordionProps } from "./accordion.types";
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
} from "./subcomponents";

export const Accordion = ({
  items,
  defaultValue,
  value,
  onValueChange,
  disabled,
  orientation,
  multiple,
  fullwidth,
  variant,
  size,
  RootProps,
  ItemProps,
  HeaderProps,
  TriggerProps,
  PanelProps,
  ContentProps,
}: AccordionProps) => {
  return (
    <AccordionRoot
      {...RootProps}
      {...definedProps({
        fullwidth,
        variant,
        defaultValue,
        value,
        onValueChange,
        disabled,
        orientation,
        multiple,
      })}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          {...ItemProps}
        >
          <AccordionHeader {...HeaderProps}>
            <AccordionTrigger {...TriggerProps} icon={item.icon} size={size}>
              {item.trigger}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel {...PanelProps} size={size}>
            <AccordionContent {...ContentProps}>
              {item.content}
            </AccordionContent>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
};
Accordion.displayName = "Accordion";
