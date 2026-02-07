"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AccordionItemProps } from "../accordion.types";

export const AccordionItem = ({
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cx(className)}
      render={<Stack ax="stretch" fullwidth bb={1} />}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  );
};
AccordionItem.displayName = "AccordionItem";
