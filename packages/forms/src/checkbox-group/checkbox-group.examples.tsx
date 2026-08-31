"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Checkbox } from "../checkbox/checkbox";
import { Form } from "../form/form";
import type { FormItemProps } from "../types";
import { CheckboxGroup } from "./checkbox-group";

const ITEMS: FormItemProps[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "post", label: "Post", disabled: true },
];

const LABEL = "Notification channels";
const DESCRIPTION = "Pick every channel you want to hear from us on.";
const ERROR = "Choose at least one channel";

export const Default = () => <CheckboxGroup items={ITEMS} />;

export const WithLabel = () => (
  <CheckboxGroup label={LABEL} description={DESCRIPTION} items={ITEMS} />
);

export const Horizontal = () => (
  <CheckboxGroup direction="horizontal" items={ITEMS} />
);

export const Bordered = () => (
  <Stack gap={6} ax="stretch">
    <CheckboxGroup bordered items={ITEMS} />
    <CheckboxGroup bordered reversed direction="horizontal" items={ITEMS} />
  </Stack>
);

/* Anything not covered by the group's own props reaches every box through
 * `CheckboxProps`. */
export const Sizes = () => (
  <Stack gap={6} ax="stretch">
    <CheckboxGroup
      direction="horizontal"
      items={ITEMS}
      CheckboxProps={{ size: "small" }}
    />
    <CheckboxGroup
      direction="horizontal"
      items={ITEMS}
      CheckboxProps={{ size: "medium" }}
    />
    <CheckboxGroup
      direction="horizontal"
      items={ITEMS}
      CheckboxProps={{ size: "large" }}
    />
  </Stack>
);

export const HideIndicators = () => (
  <CheckboxGroup bordered hideIndicators direction="horizontal" items={ITEMS} />
);

export const Disabled = () => (
  <CheckboxGroup disabled label={LABEL} items={ITEMS} />
);

/*
 * `required` marks the label only — HTML cannot express "at least one of
 * these", so the rule lives in the validation that produced the error.
 */
export const Required = () => (
  <CheckboxGroup required label={LABEL} items={ITEMS} />
);

/*
 * One `name` covers both jobs: it matches the group's field to the form error,
 * and it names every box's input so the group posts as a list.
 */
export const Invalid = () => (
  <Form errors={{ channels: ERROR }}>
    <CheckboxGroup name="channels" label={LABEL} items={ITEMS} />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState<string[]>(["email"]);

  return (
    <Stack gap={3} ax="stretch">
      <CheckboxGroup
        label={LABEL}
        items={ITEMS}
        value={value}
        onValueChange={setValue}
      />
      <Text size={-1} shade="muted">
        Selected: {value.length ? value.join(", ") : "none"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <CheckboxGroup label={LABEL} items={ITEMS} defaultValue={["email", "push"]} />
);

/*
 * Drop `items` and pass children to compose the boxes yourself — each one can
 * then carry its own description, size, or slot content.
 */
export const Composed = () => (
  <CheckboxGroup label={LABEL} defaultValue={["email"]}>
    <Checkbox
      bordered
      value="email"
      label="Email"
      description="Digest, sent every Monday."
    />
    <Checkbox
      bordered
      value="sms"
      label="SMS"
      description="Only for urgent account activity."
    />
  </CheckboxGroup>
);
