"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Radio } from "../radio/radio";
import type { FormItemProps } from "../types";
import { RadioGroup } from "./radio-group";

const ITEMS: FormItemProps[] = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "overnight", label: "Overnight" },
  { value: "freight", label: "Freight", disabled: true },
];

const LABEL = "Shipping speed";
const DESCRIPTION = "Delivery estimates are calculated at checkout.";
const ERROR = "Choose a shipping speed";

/* A radio group starts with nothing selected unless you say otherwise. */
export const Default = () => <RadioGroup items={ITEMS} />;

export const WithLabel = () => (
  <RadioGroup label={LABEL} description={DESCRIPTION} items={ITEMS} />
);

export const Horizontal = () => (
  <RadioGroup direction="horizontal" items={ITEMS} />
);

export const Bordered = () => (
  <Stack gap={6} ax="stretch">
    <RadioGroup bordered items={ITEMS} />
    <RadioGroup bordered reversed direction="horizontal" items={ITEMS} />
  </Stack>
);

/* Anything not covered by the group's own props reaches every radio through
 * `RadioProps`. */
export const Sizes = () => (
  <Stack gap={6} ax="stretch">
    <RadioGroup
      direction="horizontal"
      items={ITEMS}
      RadioProps={{ size: "small" }}
    />
    <RadioGroup
      direction="horizontal"
      items={ITEMS}
      RadioProps={{ size: "medium" }}
    />
    <RadioGroup
      direction="horizontal"
      items={ITEMS}
      RadioProps={{ size: "large" }}
    />
  </Stack>
);

export const HideIndicators = () => (
  <RadioGroup bordered hideIndicators direction="horizontal" items={ITEMS} />
);

export const Disabled = () => (
  <RadioGroup disabled label={LABEL} items={ITEMS} defaultValue="standard" />
);

export const Required = () => (
  <RadioGroup required label={LABEL} items={ITEMS} />
);

export const Invalid = () => (
  <Form errors={{ shipping: ERROR }}>
    <RadioGroup name="shipping" label={LABEL} items={ITEMS} />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("standard");

  return (
    <Stack gap={3} ax="stretch">
      <RadioGroup
        label={LABEL}
        items={ITEMS}
        value={value}
        onValueChange={(next) => setValue(String(next))}
      />
      <Text size={-1} shade="muted">
        Selected: {value}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <RadioGroup label={LABEL} items={ITEMS} defaultValue="express" />
);

/*
 * Drop `items` and pass children to compose the radios yourself — each one can
 * then carry its own description or variant.
 */
export const Composed = () => (
  <RadioGroup label={LABEL} defaultValue="standard">
    <Radio
      bordered
      value="standard"
      label="Standard"
      description="Arrives in 3–5 business days."
    />
    <Radio
      bordered
      value="express"
      label="Express"
      description="Arrives the next business day."
    />
  </RadioGroup>
);
