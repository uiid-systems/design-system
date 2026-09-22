"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { AccordionItemProps } from "../accordion.types";

import styles from "../accordion.module.css";

export const AccordionItem = ({
  ax = "stretch",
  fullwidth = true,
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cxState(styles["accordion-item"], className)}
      render={<Stack ax={ax} fullwidth={fullwidth} />}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  );
};
AccordionItem.displayName = "AccordionItem";
