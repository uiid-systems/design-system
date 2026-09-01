"use client";

import { AtSignIcon } from "@uiid/icons/at-sign";
import { LockIcon } from "@uiid/icons/lock";
import { SearchIcon } from "@uiid/icons/search";
import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Field } from "../field/field";
import { Form } from "../form/form";
import { Input } from "./input";
import type { InputVariants } from "./input.types";

type Size = NonNullable<InputVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIPTION = "We'll only ever use this to send you receipts.";
const ERROR = "Enter a valid email address";

export const Default = () => <Input placeholder="Placeholder" />;

export const WithLabel = () => (
  <Input
    label="Email"
    description={DESCRIPTION}
    placeholder="you@example.com"
  />
);

export const Sizes = () => (
  <Stack gap={4} ax="stretch">
    {SIZES.map((size) => (
      <Input
        key={size}
        size={size}
        label={size}
        placeholder="you@example.com"
      />
    ))}
  </Stack>
);

/*
 * A hue tints the whole field surface — background, border, and foreground all
 * resolve from the one prop, so the control reads as a tinted surface rather
 * than a neutral one with an accent.
 */
export const Colors = () => (
  <Stack gap={4} ax="stretch">
    {PALETTE_HUES.map((color) => (
      <Input
        key={color}
        color={color}
        label={color}
        placeholder="you@example.com"
      />
    ))}
  </Stack>
);

export const BeforeAfterSlots = () => (
  <Stack gap={4} ax="stretch">
    <Input before={<SearchIcon />} placeholder="Search" />
    <Input after={<AtSignIcon />} placeholder="Email" />
    <Input
      before={<LockIcon />}
      after={<Text size={-1}>optional</Text>}
      placeholder="Password"
      type="password"
    />
    <Input
      before={<Text size={-1}>$</Text>}
      after={<Text size={-1}>.00</Text>}
      placeholder="0"
    />
  </Stack>
);

export const Ghost = () => (
  <Stack gap={4} ax="stretch">
    <Input variant="ghost" placeholder="Ghost" />
    <Input
      variant="ghost"
      before={<SearchIcon />}
      placeholder="Ghost with a slot"
    />
  </Stack>
);

export const Fullwidth = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    <Input fullwidth placeholder="Fullwidth" />
    <Input placeholder="Not fullwidth" />
  </Stack>
);

export const Required = () => (
  <Input label="Email" required placeholder="you@example.com" />
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <Input label="Disabled" disabled placeholder="you@example.com" />
    <Input label="Read only" readOnly defaultValue="you@example.com" />
  </Stack>
);

/*
 * `Form` publishes its `errors` map to every field that shares a `name`, which
 * both marks the control invalid and supplies the message — the same path a
 * server response takes.
 */
export const Invalid = () => (
  <Form errors={{ email: ERROR }}>
    <Input name="email" label="Email" defaultValue="not-an-email" />
  </Form>
);

/*
 * `inline` reserves a line beneath the control, `tooltip` moves the message to
 * an icon beside the label, and `absolute` floats it so nothing below shifts.
 */
export const ErrorTypes = () => (
  <Form errors={{ inline: ERROR, tooltip: ERROR, absolute: ERROR }}>
    <Stack gap={8} ax="stretch">
      <Input
        name="inline"
        label="Inline"
        defaultValue="not-an-email"
        FieldProps={{ errorType: "inline" }}
      />
      <Input
        name="tooltip"
        label="Tooltip"
        defaultValue="not-an-email"
        FieldProps={{ errorType: "tooltip" }}
      />
      <Input
        name="absolute"
        label="Absolute"
        defaultValue="not-an-email"
        FieldProps={{ errorType: "absolute" }}
      />
    </Stack>
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("");

  return (
    <Stack gap={3} ax="stretch">
      <Input
        label="Search"
        before={<SearchIcon />}
        placeholder="Type to search"
        value={value}
        onValueChange={setValue}
      />
      <Text size={-1} shade="muted">
        Value: {value || "—"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <Input label="Search" before={<SearchIcon />} defaultValue="Design system" />
);

/*
 * One label over several controls: the inputs keep their own names, and the
 * surrounding `Field` supplies the shared label and description.
 */
export const Grouped = () => (
  <Field label="Full name" description="As it appears on your ID.">
    <Group gap={2} evenly fullwidth>
      <Input name="first-name" placeholder="First" />
      <Input name="last-name" placeholder="Last" />
    </Group>
  </Field>
);
