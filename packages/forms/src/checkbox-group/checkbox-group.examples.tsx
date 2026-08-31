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
 * The name goes on the group's own Field rather than on the group, because
 * `name` is also handed to every box — and each box builds a Field of its own,
 * so a shared name would print the message once per box. The tradeoff is that
 * the boxes then submit unnamed; give them one through `CheckboxProps` when the
 * group has to post. See UI-190.
 */
export const Invalid = () => (
  <Form errors={{ channels: ERROR }}>
    <CheckboxGroup
      label={LABEL}
      FieldProps={{ name: "channels" }}
      items={ITEMS}
    />
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
