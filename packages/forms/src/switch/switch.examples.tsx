"use client";

import { Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Switch } from "./switch";
import type { SwitchVariants } from "./switch.types";

type Size = NonNullable<SwitchVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const LABEL = "Enable notifications";
const DESCRIPTION = "Get a push notification when someone mentions you.";
const ERROR = "Turn this on to continue";

export const Default = () => <Switch label={LABEL} />;

export const WithDescription = () => (
  <Switch label={LABEL} description={DESCRIPTION} />
);

/*
 * A tier sets the track's width and height; the thumb and its travel derive from
 * that pair, so a switch stays in proportion at every size.
 */
export const Sizes = () => (
  <Stack gap={4}>
    {SIZES.map((size) => (
      <Switch key={size} size={size} label={size} defaultChecked />
    ))}
  </Stack>
);

/*
 * The hue fills the checked track only — an off switch stays on the shade
 * scale — so every row here is on or there would be nothing to see.
 */
export const Colors = () => (
  <Stack gap={4}>
    {PALETTE_HUES.map((color) => (
      <Switch key={color} color={color} defaultChecked label={color} />
    ))}
  </Stack>
);

/* `bordered` draws the row as a control surface; `reversed` flips the order. */
export const Bordered = () => (
  <Stack gap={4} ax="stretch">
    <Switch bordered label={LABEL} />
    <Switch bordered reversed label={LABEL} />
    <Switch bordered label={LABEL} description={DESCRIPTION} />
  </Stack>
);

export const Disabled = () => (
  <Stack gap={4}>
    <Switch disabled label="Disabled" />
    <Switch disabled defaultChecked label="Disabled and on" />
    <Switch readOnly defaultChecked label="Read only" />
  </Stack>
);

export const Invalid = () => (
  <Form errors={{ notifications: ERROR }}>
    <Switch name="notifications" label={LABEL} />
  </Form>
);

export const Controlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Stack gap={3}>
      <Switch label={LABEL} checked={checked} onCheckedChange={setChecked} />
      <Text size={-1} shade="muted">
        Notifications are {checked ? "on" : "off"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => <Switch defaultChecked label={LABEL} />;
