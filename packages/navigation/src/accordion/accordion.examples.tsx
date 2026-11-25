"use client";

import { InfoIcon } from "@uiid/icons/info";
import { SettingsIcon } from "@uiid/icons/settings";
import { UserIcon } from "@uiid/icons/user";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Accordion } from "./accordion";
import type { AccordionItemData } from "./accordion.types";
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "./subcomponents";

const ITEMS: AccordionItemData[] = [
  {
    value: "shipping",
    trigger: "How long does shipping take?",
    content: "Orders leave the warehouse within two working days.",
  },
  {
    value: "returns",
    trigger: "Can I return an item?",
    content: "Anything unused can come back within 30 days for a full refund.",
  },
  {
    value: "support",
    trigger: "How do I reach support?",
    content: "Write to us any time and we reply within one working day.",
  },
];

export const Default = () => <Accordion items={ITEMS} />;

/* `defaultValue` opens items on mount; `multiple` lets several stay open. */
export const Multiple = () => (
  <Accordion items={ITEMS} defaultValue={["shipping", "returns"]} multiple />
);

/* `value` and `onValueChange` hold the open items in your own state. */
export const Controlled = () => {
  const [open, setOpen] = useState<string[]>(["returns"]);

  return (
    <Stack gap={3} w="full">
      <Accordion items={ITEMS} value={open} onValueChange={setOpen} />
      <Text size={-1} emphasis="muted">
        Open: {open.length > 0 ? open.join(", ") : "none"}
      </Text>
    </Stack>
  );
};

/* An item's `icon` is drawn before its trigger. */
export const Icons = () => (
  <Accordion
    items={[
      {
        value: "about",
        icon: InfoIcon,
        trigger: "About",
        content: "What this workspace is for.",
      },
      {
        value: "profile",
        icon: UserIcon,
        trigger: "Profile",
        content: "Your name, photo and contact details.",
      },
      {
        value: "settings",
        icon: SettingsIcon,
        trigger: "Settings",
        content: "Notifications, language and privacy.",
      },
    ]}
  />
);

export const Sizes = () => (
  <Stack gap={4} w="full">
    {(["small", "medium", "large"] as const).map((size) => (
      <Accordion key={size} items={ITEMS} size={size} />
    ))}
  </Stack>
);

/* `ghost` drops the card surface and the rules between items. */
export const Ghost = () => <Accordion items={ITEMS} variant="ghost" />;

/* `disabled` on Accordion locks every item; on an item, only that one. */
export const Disabled = () => (
  <Stack gap={4} w="full">
    <Accordion items={ITEMS} disabled />
    <Accordion
      items={ITEMS.map((item) => ({
        ...item,
        disabled: item.value === "returns",
      }))}
    />
  </Stack>
);

/* The root is a Card, so space the items through its inner container. */
export const Spaced = () => (
  <Accordion
    items={ITEMS}
    variant="ghost"
    RootProps={{ InnerContainerProps: { gap: 2 } }}
  />
);

/* Compose the parts for content that isn't one string per item. */
export const Composed = () => (
  <AccordionRoot defaultValue={["details"]}>
    <AccordionItem value="details">
      <AccordionHeader>
        <AccordionTrigger icon={InfoIcon}>Order details</AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel>
        <AccordionContent gap={2}>
          <Text>Order #1042, placed on 3 March.</Text>
          <Text emphasis="muted">Two items, shipped together.</Text>
        </AccordionContent>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="delivery">
      <AccordionHeader>
        <AccordionTrigger>Delivery</AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel>
        <AccordionContent>
          <Text>Arriving Thursday between 9am and 1pm.</Text>
        </AccordionContent>
      </AccordionPanel>
    </AccordionItem>
  </AccordionRoot>
);
