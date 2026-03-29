"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";

import { ChevronsUpDown } from "@uiid/icons";
import { ConditionalRender, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AccordionTriggerProps } from "../accordion.types";
import { accordionTriggerVariants } from "../accordion.variants";
import styles from "../accordion.module.css";

export const AccordionTrigger = ({
  icon,
  size,
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  const Icon = icon;
  return (
    <BaseAccordion.Trigger
      data-slot="accordion-trigger"
      className={cx(
        styles["accordion-trigger"],
        accordionTriggerVariants({ size }),
        className,
      )}
      {...props}
    >
      <ConditionalRender
        condition={!!icon}
        render={<Group ay="center" gap={1} />}
      >
        {Icon && <Icon />}
        <Text shade="muted" size={0} weight="bold">
          {children}
        </Text>
      </ConditionalRender>
      <ChevronsUpDown />
    </BaseAccordion.Trigger>
  );
};
AccordionTrigger.displayName = "AccordionTrigger";
