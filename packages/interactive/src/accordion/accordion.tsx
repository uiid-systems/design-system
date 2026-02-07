import type { AccordionProps } from "./accordion.types";

import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "./subcomponents";

export const Accordion = ({
  items,
  defaultValue,
  value,
  onValueChange,
  disabled,
  orientation,
  multiple,
  RootProps,
  ItemProps,
  HeaderProps,
  TriggerProps,
  PanelProps,
}: AccordionProps) => {
  return (
    <AccordionRoot
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      orientation={orientation}
      multiple={multiple}
      {...RootProps}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          {...ItemProps}
        >
          <AccordionHeader {...HeaderProps}>
            <AccordionTrigger icon={item.icon} {...TriggerProps}>
              {item.trigger}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel {...PanelProps}>{item.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
};
Accordion.displayName = "Accordion";
