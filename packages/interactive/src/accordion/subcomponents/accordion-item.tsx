"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AccordionItemProps } from "../accordion.types";
import styles from "../accordion.module.css";

export const AccordionItem = ({
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cx(styles["accordion-item"], className)}
      render={<Stack ax="stretch" fullwidth />}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  );
};
AccordionItem.displayName = "AccordionItem";
