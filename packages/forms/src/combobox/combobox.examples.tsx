"use client";

import { SearchIcon } from "@uiid/icons/search";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Field } from "../field/field";
import { Form } from "../form/form";
import { Combobox } from "./combobox";
import { MOCK_COMBOBOX_ITEMS } from "./combobox.mocks";
import {
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxValue,
} from "./subcomponents";

const DESCRIPTION = "Start typing to filter the list.";
const ERROR = "Pick a fruit from the list";

export const Default = () => (
  <Combobox items={MOCK_COMBOBOX_ITEMS} placeholder="Search fruit" />
);

export const WithLabel = () => (
  <Combobox
    label="Fruit"
    description={DESCRIPTION}
    items={MOCK_COMBOBOX_ITEMS}
    placeholder="Search fruit"
  />
);

export const BeforeAfterSlots = () => (
  <Combobox
    label="Fruit"
    before={<SearchIcon />}
    items={MOCK_COMBOBOX_ITEMS}
    placeholder="Search fruit"
  />
);

export const Disabled = () => (
  <Stack gap={4} ax="stretch">
    <Combobox label="Disabled" disabled items={MOCK_COMBOBOX_ITEMS} />
    <Combobox
      label="Read only"
      readOnly
      defaultValue="cherry"
      items={MOCK_COMBOBOX_ITEMS}
    />
  </Stack>
);

export const Required = () => (
  <Combobox label="Fruit" required items={MOCK_COMBOBOX_ITEMS} />
);

/*
 * The name has to reach the input's Field for a `Form` error to find it, which
 * is what `InputProps` is for — `name` on the Combobox itself goes to the root,
 * where it drives form submission. See UI-191.
 */
export const Invalid = () => (
  <Form errors={{ fruit: ERROR }}>
    <Combobox
      name="fruit"
      label="Fruit"
      items={MOCK_COMBOBOX_ITEMS}
      InputProps={{ name: "fruit" }}
    />
  </Form>
);

export const Controlled = () => {
  const [value, setValue] = useState("apple");

  return (
    <Stack gap={3} ax="stretch">
      <Combobox
        label="Fruit"
        items={MOCK_COMBOBOX_ITEMS}
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
  <Combobox label="Fruit" items={MOCK_COMBOBOX_ITEMS} defaultValue="cherry" />
);

/*
 * Compose the parts for multiple selection: `Chips` replaces the plain input
 * row, and `Value` renders one chip per selected item.
 */
export const Multiple = () => (
  <ComboboxRoot multiple items={MOCK_COMBOBOX_ITEMS}>
    <ComboboxChips>
      <ComboboxValue>
        {(selected: string[]) =>
          selected.map((item) => (
            <ComboboxChip key={item}>
              {item}
              <ComboboxChipRemove />
            </ComboboxChip>
          ))
        }
      </ComboboxValue>
      <ComboboxInput placeholder="Add fruit" />
    </ComboboxChips>

    <ComboboxPortal>
      <ComboboxPositioner>
        <ComboboxPopup>
          <ComboboxList>
            {(item: string) => <ComboboxItem key={item} value={item} />}
          </ComboboxList>
          <ComboboxEmpty />
        </ComboboxPopup>
      </ComboboxPositioner>
    </ComboboxPortal>
  </ComboboxRoot>
);

/* One label over several controls. */
export const Grouped = () => (
  <Field label="Fruit basket" description={DESCRIPTION}>
    <Group gap={2} evenly fullwidth>
      <Combobox items={MOCK_COMBOBOX_ITEMS} placeholder="First" />
      <Combobox items={MOCK_COMBOBOX_ITEMS} placeholder="Second" />
    </Group>
  </Field>
);
