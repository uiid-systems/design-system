"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { NumberField } from "./number-field";
import type { NumberFieldVariants } from "./number-field.types";
import {
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from "./subcomponents";

type Size = NonNullable<NumberFieldVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIPTION = "Use the arrow keys for fine adjustments.";
const ERROR = "Enter a quantity of 1 or more";

export const Default = () => <NumberField defaultValue={1} />;

export const WithLabel = () => (
  <NumberField label="Quantity" description={DESCRIPTION} defaultValue={1} />
);

export const Sizes = () => (
  <Stack gap={4} ax="start">
    {SIZES.map((size) => (
      <NumberField key={size} size={size} label={size} defaultValue={1} />
    ))}
  </Stack>
);

/* Outside the range the stepper buttons disable themselves. */
export const MinMax = () => (
  <NumberField
    label="Seats"
    description="Between 1 and 8."
    min={1}
    max={8}
    defaultValue={1}
  />
);

/*
 * `step` is the default increment, `largeStep` applies with shift held, and
 * `smallStep` with alt.
 */
export const Steps = () => (
  <Stack gap={4} ax="start">
    <NumberField label="Step of 5" step={5} defaultValue={0} />
    <NumberField
      label="Shift for 10, alt for 0.1"
      step={1}
      largeStep={10}
      smallStep={0.1}
      defaultValue={0}
    />
    <NumberField
      label="Snapped to the step"
      step={25}
      snapOnStep
      defaultValue={0}
    />
  </Stack>
);

/* `format` takes Intl.NumberFormat options. */
export const Format = () => (
  <Stack gap={4} ax="start">
    <NumberField
      label="Price"
      format={{ style: "currency", currency: "USD" }}
      defaultValue={19.99}
      step={0.01}
    />
    <NumberField
      label="Completion"
      format={{ style: "percent" }}
      defaultValue={0.65}
      step={0.05}
    />
    <NumberField
      label="Weight"
      format={{ style: "unit", unit: "kilogram" }}
      defaultValue={5}
    />
  </Stack>
);

export const Placeholder = () => (
  <NumberField label="Quantity" placeholder="0" />
);

export const Disabled = () => (
  <Stack gap={4} ax="start">
    <NumberField label="Disabled" disabled defaultValue={1} />
    <NumberField label="Read only" readOnly defaultValue={1} />
  </Stack>
);

export const Required = () => <NumberField label="Quantity" required />;

export const Invalid = () => (
  <Form errors={{ quantity: ERROR }}>
    <NumberField name="quantity" label="Quantity" defaultValue={0} />
  </Form>
);

export const ErrorTypes = () => (
  <Form errors={{ inline: ERROR, tooltip: ERROR, absolute: ERROR }}>
    <Stack gap={8} ax="start">
      <NumberField
        name="inline"
        label="Inline"
        FieldProps={{ errorType: "inline" }}
      />
      <NumberField
        name="tooltip"
        label="Tooltip"
        FieldProps={{ errorType: "tooltip" }}
      />
      <NumberField
        name="absolute"
        label="Absolute"
        FieldProps={{ errorType: "absolute" }}
      />
    </Stack>
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState<number | null>(2);

  return (
    <Stack gap={3} ax="start">
      <NumberField label="Quantity" value={value} onValueChange={setValue} />
      <Text size={-1} shade="muted">
        Value: {value ?? "—"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <NumberField label="Quantity" defaultValue={3} />
);

/*
 * Compose the parts to add a scrub area — dragging the label changes the value,
 * which is faster than stepping for coarse adjustments.
 */
export const WithScrubArea = () => (
  <NumberFieldRoot defaultValue={50} min={0} max={100}>
    <Stack gap={3} ax="start">
      <NumberFieldScrubArea>
        <Text size={-1}>Opacity</Text>
        <NumberFieldScrubAreaCursor />
      </NumberFieldScrubArea>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </Stack>
  </NumberFieldRoot>
);
