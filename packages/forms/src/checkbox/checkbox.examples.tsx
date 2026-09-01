"use client";

import { Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Checkbox } from "./checkbox";
import type { CheckboxVariants } from "./checkbox.types";

type Size = NonNullable<CheckboxVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const LABEL = "Email me about product updates";
const DESCRIPTION = "Roughly one message a month. Unsubscribe at any time.";
const ERROR = "You must accept the terms to continue";

export const Default = () => <Checkbox label={LABEL} />;

export const WithDescription = () => (
  <Checkbox label={LABEL} description={DESCRIPTION} />
);

export const Sizes = () => (
  <Stack gap={4}>
    {SIZES.map((size) => (
      <Checkbox key={size} size={size} label={size} />
    ))}
  </Stack>
);

/*
 * The hue fills the checked box only — an unchecked box stays on the shade
 * scale — so every row here is checked or there would be nothing to see.
 */
export const Colors = () => (
  <Stack gap={4}>
    {PALETTE_HUES.map((color) => (
      <Checkbox key={color} color={color} defaultChecked label={color} />
    ))}
  </Stack>
);

/* `bordered` draws the row as a control surface; `reversed` flips the order. */
export const Bordered = () => (
  <Stack gap={4} ax="stretch">
    <Checkbox bordered label={LABEL} />
    <Checkbox bordered reversed label={LABEL} />
    <Checkbox bordered label={LABEL} description={DESCRIPTION} />
  </Stack>
);

/*
 * The box is hidden from sight but stays in the accessibility tree, so the row
 * still reads and toggles as a checkbox.
 */
export const HideIndicator = () => (
  <Checkbox bordered hideIndicator label={LABEL} />
);

export const Indeterminate = () => (
  <Checkbox indeterminate defaultChecked label="Select all" />
);

export const Disabled = () => (
  <Stack gap={4}>
    <Checkbox disabled label="Disabled" />
    <Checkbox disabled defaultChecked label="Disabled and checked" />
    <Checkbox readOnly defaultChecked label="Read only" />
  </Stack>
);

export const Required = () => <Checkbox required label="I accept the terms" />;

export const Invalid = () => (
  <Form errors={{ terms: ERROR }}>
    <Checkbox name="terms" label="I accept the terms" />
  </Form>
);

export const Controlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Stack gap={3}>
      <Checkbox label={LABEL} checked={checked} onCheckedChange={setChecked} />
      <Text size={-1} shade="muted">
        {checked ? "Subscribed" : "Not subscribed"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => <Checkbox defaultChecked label={LABEL} />;
