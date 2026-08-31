"use client";

import { CircleQuestionMarkIcon } from "@uiid/icons/circle-question-mark";
import { InfoIcon } from "@uiid/icons/info";
import { Group, Stack } from "@uiid/layout";

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
import type { FieldErrorType } from "./field.types";

const ERROR_TYPES: FieldErrorType[] = ["inline", "tooltip", "absolute"];

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

export const Required = () => (
  <Field label="Email" required>
    <InputControl placeholder="you@example.com" required />
  </Field>
);

/*
 * A hint sits at the end of the label row. Text alone reads as a quiet aside;
 * an icon plus `tooltip` keeps longer guidance out of the layout entirely.
 */
export const WithHint = () => (
  <Stack gap={6} ax="stretch">
    <Field label="Email" hint={{ text: "Optional" }}>
      <InputControl placeholder="you@example.com" />
    </Field>
    <Field label="Email" hint={{ icon: InfoIcon, text: "Optional" }}>
      <InputControl placeholder="you@example.com" />
    </Field>
    <Field
      label="Email"
      hint={{
        icon: CircleQuestionMarkIcon,
        tooltip: "Used for receipts and password resets only.",
      }}
    >
      <InputControl placeholder="you@example.com" />
    </Field>
  </Stack>
);

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
 * A field with no label, hint, description, or out-of-flow error paints no
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
      <RadioGroup bordered direction="horizontal" items={CHANNELS} />
    </Field>
    <Field label="Checkbox group" description={DESCRIPTION}>
      <CheckboxGroup bordered direction="horizontal" items={CHANNELS} />
    </Field>
    <Field label="Switch" description={DESCRIPTION}>
      <Switch bordered label="Enabled" />
    </Field>
    <Field label="Long form" description={DESCRIPTION}>
      <Textarea placeholder="Type something" rows={3} />
    </Field>
  </Stack>
);
