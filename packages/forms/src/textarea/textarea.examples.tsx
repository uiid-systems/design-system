"use client";

import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Form } from "../form/form";
import { Textarea } from "./textarea";
import type { TextareaResize, TextareaVariants } from "./textarea.types";

type Size = NonNullable<TextareaVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];
const RESIZE: TextareaResize[] = ["none", "vertical", "horizontal", "both"];

const DESCRIPTION = "Markdown is supported.";
const ERROR = "Tell us a little more — 20 characters minimum";

export const Default = () => <Textarea placeholder="Placeholder" />;

export const WithLabel = () => (
  <Textarea
    label="Release notes"
    description={DESCRIPTION}
    placeholder="What changed?"
  />
);

export const Sizes = () => (
  <Stack gap={4} ax="stretch">
    {SIZES.map((size) => (
      <Textarea
        key={size}
        size={size}
        label={size}
        placeholder="What changed?"
      />
    ))}
  </Stack>
);

/* `rows` sets the starting height; `size` sets the type scale and padding. */
export const Rows = () => (
  <Group gap={4} ay="start">
    <Textarea rows={2} label="2 rows" />
    <Textarea rows={4} label="4 rows" />
    <Textarea rows={8} label="8 rows" />
  </Group>
);

export const Resize = () => (
  <Stack gap={4} ax="stretch">
    {RESIZE.map((resize) => (
      <Textarea key={resize} resize={resize} label={resize} rows={2} />
    ))}
  </Stack>
);

export const Ghost = () => (
  <Textarea variant="ghost" placeholder="Ghost" rows={3} />
);

export const Fullwidth = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    <Textarea fullwidth placeholder="Fullwidth" rows={2} />
    <Textarea placeholder="Not fullwidth" rows={2} />
  </Stack>
);

export const Required = () => (
  <Textarea label="Release notes" required placeholder="What changed?" />
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <Textarea label="Disabled" disabled placeholder="What changed?" />
    <Textarea
      label="Read only"
      readOnly
      defaultValue="Shipped the forms docs surface."
    />
  </Stack>
);

export const Invalid = () => (
  <Form errors={{ notes: ERROR }}>
    <Textarea name="notes" label="Release notes" defaultValue="Fixed it" />
  </Form>
);

export const ErrorTypes = () => (
  <Form errors={{ inline: ERROR, tooltip: ERROR, absolute: ERROR }}>
    <Stack gap={8} ax="stretch">
      <Textarea
        name="inline"
        label="Inline"
        rows={2}
        FieldProps={{ errorType: "inline" }}
      />
      <Textarea
        name="tooltip"
        label="Tooltip"
        rows={2}
        FieldProps={{ errorType: "tooltip" }}
      />
      <Textarea
        name="absolute"
        label="Absolute"
        rows={2}
        FieldProps={{ errorType: "absolute" }}
      />
    </Stack>
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("");

  return (
    <Stack gap={3} ax="stretch">
      <Textarea
        label="Bio"
        rows={3}
        placeholder="Tell us about yourself"
        value={value}
        onValueChange={setValue}
      />
      <Text size={-1} shade="muted">
        {value.length} characters
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <Textarea
    label="Bio"
    rows={3}
    defaultValue="Design engineer working on the UIID system."
  />
);
