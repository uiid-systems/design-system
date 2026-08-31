"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Slider } from "./slider";
import type { SliderVariants } from "./slider.types";

type Size = NonNullable<SliderVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIPTION = "Applies to every output device.";
const ERROR = "Pick a value above 10";

export const Default = () => <Slider defaultValue={40} />;

export const WithLabel = () => (
  <Slider label="Volume" description={DESCRIPTION} defaultValue={40} />
);

/*
 * The tier sets the control row's height, inset and readout. Track and thumb
 * stay a fixed scale so a small slider keeps a usable grab target.
 */
export const Sizes = () => (
  <Stack gap={4} ax="stretch">
    {SIZES.map((size) => (
      <Slider key={size} size={size} label={size} defaultValue={40} />
    ))}
  </Stack>
);

/* An array default gives one thumb per value, so a two-value slider is a range. */
export const Range = () => (
  <Slider label="Price range" defaultValue={[25, 75]} />
);

export const MinMaxStep = () => (
  <Stack gap={6} ax="stretch">
    <Slider label="0 to 100, step 1" defaultValue={40} />
    <Slider
      label="0 to 10, step 0.5"
      min={0}
      max={10}
      step={0.5}
      defaultValue={5}
    />
    <Slider
      label="Step 10, shift for 20"
      step={10}
      largeStep={20}
      defaultValue={30}
    />
  </Stack>
);

/* `format` takes Intl.NumberFormat options and reaches the readout. */
export const Format = () => (
  <Stack gap={6} ax="stretch">
    <Slider
      label="Budget"
      format={{ style: "currency", currency: "USD" }}
      min={0}
      max={1000}
      step={50}
      defaultValue={400}
    />
    <Slider
      label="Completion"
      format={{ style: "percent" }}
      min={0}
      max={1}
      step={0.05}
      defaultValue={0.65}
    />
  </Stack>
);

/*
 * `ValueProps.children` is a render function receiving the formatted strings
 * and the raw numbers — the way to replace the default readout.
 */
export const CustomValue = () => (
  <Slider
    label="Price range"
    defaultValue={[25, 75]}
    ValueProps={{
      children: (formatted) => `${formatted[0]} to ${formatted[1]}`,
    }}
  />
);

export const Vertical = () => (
  <Slider orientation="vertical" label="Volume" defaultValue={40} />
);

export const Ghost = () => <Slider ghost label="Volume" defaultValue={40} />;

export const Disabled = () => (
  <Slider disabled label="Volume" defaultValue={40} />
);

export const Invalid = () => (
  <Form errors={{ volume: ERROR }}>
    <Slider name="volume" label="Volume" defaultValue={5} />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState<number | readonly number[]>(40);

  return (
    <Stack gap={3} ax="stretch">
      <Slider label="Volume" value={value} onValueChange={setValue} />
      <Text size={-1} shade="muted">
        Value: {String(value)}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => <Slider label="Volume" defaultValue={65} />;
