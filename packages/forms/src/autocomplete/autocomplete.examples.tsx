"use client";

import { SearchIcon } from "@uiid/icons/search";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Field } from "../field/field";
import { Form } from "../form/form";
import { Autocomplete } from "./autocomplete";
import { MOCK_AUTOCOMPLETE_ITEMS } from "./autocomplete.mocks";

const DESCRIPTION = "Suggestions narrow as you type; any value is accepted.";
const ERROR = "We don't stock that fruit";

/*
 * Autocomplete suggests without constraining — the typed value stands on its
 * own. Reach for Combobox when the value has to come from the list.
 */
export const Default = () => (
  <Autocomplete items={MOCK_AUTOCOMPLETE_ITEMS} placeholder="Search fruit" />
);

export const WithLabel = () => (
  <Autocomplete
    label="Fruit"
    description={DESCRIPTION}
    items={MOCK_AUTOCOMPLETE_ITEMS}
    placeholder="Search fruit"
  />
);

export const BeforeAfterSlots = () => (
  <Autocomplete
    label="Fruit"
    before={<SearchIcon />}
    items={MOCK_AUTOCOMPLETE_ITEMS}
    placeholder="Search fruit"
  />
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <Autocomplete label="Disabled" disabled items={MOCK_AUTOCOMPLETE_ITEMS} />
    <Autocomplete
      label="Read only"
      readOnly
      defaultValue="cherry"
      items={MOCK_AUTOCOMPLETE_ITEMS}
    />
  </Stack>
);

export const Required = () => (
  <Autocomplete label="Fruit" required items={MOCK_AUTOCOMPLETE_ITEMS} />
);

export const Invalid = () => (
  <Form errors={{ fruit: ERROR }}>
    <Autocomplete name="fruit" label="Fruit" items={MOCK_AUTOCOMPLETE_ITEMS} />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("apple");

  return (
    <Stack gap={3} ax="stretch">
      <Autocomplete
        label="Fruit"
        items={MOCK_AUTOCOMPLETE_ITEMS}
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
  <Autocomplete
    label="Fruit"
    items={MOCK_AUTOCOMPLETE_ITEMS}
    defaultValue="cherry"
  />
);

/* One label over several controls. */
export const Grouped = () => (
  <Field label="Fruit basket" description={DESCRIPTION}>
    <Group gap={2} evenly fullwidth>
      <Autocomplete items={MOCK_AUTOCOMPLETE_ITEMS} placeholder="First" />
      <Autocomplete items={MOCK_AUTOCOMPLETE_ITEMS} placeholder="Second" />
    </Group>
  </Field>
);
