"use client";

import { Button } from "@uiid/buttons";
import { CircleQuestionMarkIcon } from "@uiid/icons/circle-question-mark";
import { InfoIcon } from "@uiid/icons/info";
import { Group, Stack } from "@uiid/layout";
import { useState } from "react";

import { CheckboxGroup } from "../checkbox-group/checkbox-group";
import { Form } from "../form/form";
import { Input } from "../input/input";
import { InputControl } from "../input/subcomponents";
import { NumberField } from "../number-field/number-field";
import { RadioGroup } from "../radio-group/radio-group";
import { Select } from "../select/select";
import { MOCK_SELECT_ITEMS } from "../select/select.mocks";
import { Slider } from "../slider/slider";
import { Switch } from "../switch/switch";
import { Textarea } from "../textarea/textarea";
import { Field } from "./field";
import type { FieldErrorType, FieldVariants } from "./field.types";
import { FieldHint } from "./subcomponents";

const ERROR_TYPES: FieldErrorType[] = ["inline", "tooltip", "absolute"];
const SIZES: NonNullable<FieldVariants["size"]>[] = [
  "xsmall",
  "small",
  "medium",
  "large",
];

const CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
];

const DESCRIPTION = "We'll never share this with anyone.";
const ERROR = "Enter a valid email address";

export const Default = () => (
  <Field label="Email">
    <InputControl placeholder="you@example.com" />
  </Field>
);

export const WithDescription = () => (
  <Field label="Email" description={DESCRIPTION}>
    <InputControl placeholder="you@example.com" />
  </Field>
);

/*
 * Chrome is sized against the control it wraps rather than against the page:
 * each tier publishes the same `--forms-size-*-font-size` the control itself
 * reads, so a label can never drift from the text inside its own input, and the
 * gap stacking them tightens to match. Controls forward their `size`, so this
 * is the field a bare `size` on an `Input` already produces.
 */
export const Sizes = () => (
  <Stack gap={6} ax="stretch">
    {SIZES.map((size) => (
      <Input
        key={size}
        size={size}
        label={size}
        description={DESCRIPTION}
        placeholder="you@example.com"
      />
    ))}
  </Stack>
);

export const Required = () => (
  <Field label="Email" required>
    <InputControl placeholder="you@example.com" required />
  </Field>
);

/*
 * `FieldHint` is ready-made content for the `action` slot, and stays the way to
 * write a static aside. Text alone reads as a quiet note; an icon plus
 * `tooltip` keeps longer guidance out of the layout entirely.
 */
export const WithHint = () => (
  <Stack gap={6} ax="stretch">
    <Field label="Email" action={<FieldHint text="Optional" />}>
      <InputControl placeholder="you@example.com" />
    </Field>
    <Field label="Email" action={<FieldHint icon={InfoIcon} text="Optional" />}>
      <InputControl placeholder="you@example.com" />
    </Field>
    <Field
      label="Email"
      action={
        <FieldHint
          icon={CircleQuestionMarkIcon}
          tooltip="Used for receipts and password resets only."
        />
      }
    >
      <InputControl placeholder="you@example.com" />
    </Field>
  </Stack>
);

/*
 * `action` takes any node, so the label row can carry something interactive.
 * The reset only renders once a channel is picked, and the row reserves the
 * height of an `xsmall` button either way, so the control never shifts as it
 * appears and disappears.
 */
export const WithAction = () => {
  const [channel, setChannel] = useState<string | null>(null);

  return (
    <Select
      label="Channel"
      placeholder="Any"
      items={CHANNELS}
      value={channel}
      onValueChange={(value) => setChannel(value)}
      action={
        channel && (
          <Button
            size="xsmall"
            variant="ghost"
            onClick={() => setChannel(null)}
          >
            Reset
          </Button>
        )
      }
    />
  );
};

/*
 * `validate` runs against the control's value and returns the message, or
 * `null` when the value passes. `validationMode` decides when it runs.
 */
export const Validate = () => (
  <Field
    label="Username"
    description="At least three letters or numbers."
    validationMode="onChange"
    validate={(value) =>
      /^[a-z0-9]{3,}$/i.test(String(value ?? ""))
        ? null
        : "Use at least three letters or numbers"
    }
  >
    <InputControl placeholder="uiid" />
  </Field>
);

/*
 * `inline` reserves a line beneath the control, `tooltip` moves the message to
 * an icon beside the label, and `absolute` floats it so nothing below shifts.
 */
export const ErrorTypes = () => (
  <Form errors={{ inline: ERROR, tooltip: ERROR, absolute: ERROR }}>
    <Stack gap={8} ax="stretch">
      {ERROR_TYPES.map((errorType) => (
        <Field
          key={errorType}
          name={errorType}
          label={errorType}
          errorType={errorType}
        >
          <InputControl defaultValue="not-an-email" />
        </Field>
      ))}
    </Stack>
  </Form>
);

/* `Form` publishes its `errors` map to every field that shares a `name`. */
export const Invalid = () => (
  <Form errors={{ email: ERROR }}>
    <Field name="email" label="Email">
      <InputControl defaultValue="not-an-email" />
    </Field>
  </Form>
);

export const Disabled = () => (
  <Field label="Email" description={DESCRIPTION} disabled>
    <InputControl placeholder="you@example.com" />
  </Field>
);

/*
 * A field with no label, action, description, or out-of-flow error paints no
 * chrome and adds no layout — the control sits exactly where it would alone,
 * while still joining the field's validation graph.
 */
export const Bare = () => (
  <Field>
    <InputControl placeholder="you@example.com" />
  </Field>
);

/* One label over several controls that each keep their own name. */
export const Grouped = () => (
  <Field label="Full name" description="As it appears on your ID.">
    <Group gap={2} evenly fullwidth>
      <Input name="first-name" placeholder="First" />
      <Input name="last-name" placeholder="Last" />
    </Group>
  </Field>
);

/*
 * Every control in the package composes into a Field, so the label,
 * description, and error treatment stay identical across control types.
 */
export const AnyControl = () => (
  <Stack gap={8} ax="stretch">
    <Field label="Text" description={DESCRIPTION}>
      <Input placeholder="Type something" />
    </Field>
    <Field label="Select" description={DESCRIPTION}>
      <Select items={MOCK_SELECT_ITEMS} />
    </Field>
    <Field label="Number" description={DESCRIPTION}>
      <NumberField defaultValue={1} />
    </Field>
    <Field label="Range" description={DESCRIPTION}>
      <Slider defaultValue={40} />
    </Field>
    <Field label="Radio group" description={DESCRIPTION}>
      <RadioGroup bordered orientation="horizontal" items={CHANNELS} />
    </Field>
    <Field label="Checkbox group" description={DESCRIPTION}>
      <CheckboxGroup bordered orientation="horizontal" items={CHANNELS} />
    </Field>
    <Field label="Switch" description={DESCRIPTION}>
      <Switch bordered label="Enabled" />
    </Field>
    <Field label="Long form" description={DESCRIPTION}>
      <Textarea placeholder="Type something" rows={3} />
    </Field>
  </Stack>
);
