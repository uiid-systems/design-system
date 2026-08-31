"use client";

import { AtSignIcon } from "@uiid/icons/at-sign";
import { SearchIcon } from "@uiid/icons/search";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Field } from "../field/field";
import { Form } from "../form/form";
import type { InputVariants } from "../input/input.types";
import { Select } from "./select";
import { MOCK_SELECT_ITEMS } from "./select.mocks";
import type { SelectItemProps } from "./select.types";
import { SelectItem } from "./subcomponents";

type Size = NonNullable<InputVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

const DESCRIBED_ITEMS: SelectItemProps[] = [
  {
    value: "sans",
    label: "Sans-serif",
    description: "Neutral, and the safest default for UI.",
  },
  {
    value: "serif",
    label: "Serif",
    description: "Editorial, best at long reading lengths.",
  },
  {
    value: "mono",
    label: "Monospace",
    description: "Fixed width, for code and tabular data.",
  },
];

const LONG_ITEMS: SelectItemProps[] = [
  {
    value: "long",
    label:
      "A very long option label that cannot fit inside the trigger and has to truncate",
  },
  { value: "short", label: "Short option" },
];

const DESCRIPTION = "Applies to every surface in the workspace.";
const ERROR = "Choose a typeface";

export const Default = () => <Select items={MOCK_SELECT_ITEMS} />;

export const WithLabel = () => (
  <Select
    label="Typeface"
    description={DESCRIPTION}
    items={MOCK_SELECT_ITEMS}
  />
);

/* With a placeholder the select opens empty instead of preselecting the first
 * item. */
export const Placeholder = () => (
  <Select placeholder="Select a typeface" items={MOCK_SELECT_ITEMS} />
);

export const Sizes = () => (
  <Stack gap={4} ax="stretch">
    {SIZES.map((size) => (
      <Select key={size} size={size} label={size} items={MOCK_SELECT_ITEMS} />
    ))}
  </Stack>
);

export const BeforeAfterSlots = () => (
  <Stack gap={4} ax="stretch">
    <Select before={<SearchIcon />} items={MOCK_SELECT_ITEMS} />
    <Select after={<AtSignIcon />} items={MOCK_SELECT_ITEMS} />
    <Select
      before={<SearchIcon />}
      after={<Text size={-1}>optional</Text>}
      items={MOCK_SELECT_ITEMS}
    />
  </Stack>
);

/* Items carry their own icon and description; the trigger still shows only the
 * label. */
export const ItemContent = () => (
  <Stack gap={4} ax="stretch">
    <Select label="With icons" items={MOCK_SELECT_ITEMS} />
    <Select label="With descriptions" items={DESCRIBED_ITEMS} />
  </Stack>
);

export const Multiple = () => (
  <Select
    multiple
    label="Typefaces"
    placeholder="Select typefaces"
    items={MOCK_SELECT_ITEMS}
    defaultValue={["sans", "mono"]}
  />
);

export const Ghost = () => <Select variant="ghost" items={MOCK_SELECT_ITEMS} />;

export const Fullwidth = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    <Select fullwidth items={MOCK_SELECT_ITEMS} />
    <Select items={MOCK_SELECT_ITEMS} />
  </Stack>
);

/* The trigger never grows past its container — a long value truncates instead. */
export const TruncatedValue = () => (
  <Stack gap={4} ax="stretch" maxw={280}>
    <Select fullwidth items={LONG_ITEMS} defaultValue="long" />
    <Select
      fullwidth
      before={<SearchIcon />}
      items={LONG_ITEMS}
      defaultValue="long"
    />
  </Stack>
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <Select disabled label="Disabled" items={MOCK_SELECT_ITEMS} />
    <Select readOnly label="Read only" items={MOCK_SELECT_ITEMS} />
  </Stack>
);

export const Required = () => (
  <Select required label="Typeface" items={MOCK_SELECT_ITEMS} />
);

export const Invalid = () => (
  <Form errors={{ typeface: ERROR }}>
    <Select
      name="typeface"
      label="Typeface"
      placeholder="Select a typeface"
      items={MOCK_SELECT_ITEMS}
    />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("sans");

  return (
    <Stack gap={3} ax="stretch">
      <Select
        label="Typeface"
        items={MOCK_SELECT_ITEMS}
        value={value}
        onValueChange={(next) => setValue(next ?? "")}
      />
      <Text size={-1} shade="muted">
        Value: {value || "—"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <Select label="Typeface" items={MOCK_SELECT_ITEMS} defaultValue="mono" />
);

/*
 * Drop `items` and pass children to compose the list yourself. Doing so also
 * takes over value-to-label resolution, so give the trigger a placeholder or a
 * `ValueProps` render function.
 */
export const Composed = () => (
  <Select placeholder="Select a typeface">
    <SelectItem value="sans" label="Sans-serif" />
    <SelectItem value="serif" label="Serif" />
    <SelectItem value="mono" label="Monospace" />
  </Select>
);

/* One label over several controls. */
export const Grouped = () => (
  <Field label="Type pairing" description={DESCRIPTION}>
    <Group gap={2} evenly fullwidth>
      <Select name="heading" fullwidth items={MOCK_SELECT_ITEMS} />
      <Select name="body" fullwidth items={MOCK_SELECT_ITEMS} />
    </Group>
  </Field>
);
