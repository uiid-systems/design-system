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
  ghost,
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
      fullwidth={fullwidth}
      ghost={ghost}
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
            <AccordionTrigger icon={item.icon} size={size} {...TriggerProps}>
              {item.trigger}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel size={size} {...PanelProps}>
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
