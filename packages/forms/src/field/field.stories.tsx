import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Input } from "../input/input";
import { Select } from "../select/select";
import { RadioGroup } from "../radio-group/radio-group";
import { CheckboxGroup } from "../checkbox-group/checkbox-group";
import { NumberField } from "../number-field/number-field";
import { Combobox } from "../combobox/combobox";
import { Autocomplete } from "../autocomplete/autocomplete";
import { Slider } from "../slider/slider";

import { MOCK_SELECT_ITEMS } from "../select/select.mocks";
import { MOCK_RADIOGROUP_OPTIONS } from "../radio-group/radio-group.mocks";
import { MOCK_CHECKBOXGROUP_OPTIONS } from "../checkbox-group/checkbox-group.mocks";
import { MOCK_COMBOBOX_ITEMS } from "../combobox/combobox.mocks";
import { MOCK_AUTOCOMPLETE_ITEMS } from "../autocomplete/autocomplete.mocks";

import { Field } from "./field";
import type { FieldProps } from "./field.types";

const meta = {
  title: "Forms/Field",
  component: Field,
  tags: ["danger"],
  args: {
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: false,
    disabled: false,
  },
  argTypes: {
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    LabelProps: { control: "object", table: { category: "Subcomponents" } },
    ErrorProps: { control: "object", table: { category: "Subcomponents" } },
    DescriptionProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Field {...args} label="Field with input">
        <Input placeholder="Type something..." />
      </Field>

      <Field {...args} label="Field with combobox">
        <Combobox items={MOCK_COMBOBOX_ITEMS} />
      </Field>

      <Field {...args} label="Field with autocomplete">
        <Autocomplete items={MOCK_AUTOCOMPLETE_ITEMS} />
      </Field>

      <Field {...args} label="Field with number field">
        <NumberField />
      </Field>

      <Field {...args} label="Field with select">
        <Select items={MOCK_SELECT_ITEMS} />
      </Field>

      <Field {...args} label="Field with radio group">
        <RadioGroup
          bordered
          direction="horizontal"
          items={MOCK_RADIOGROUP_OPTIONS}
        />
      </Field>

      <Field {...args} label="Field with checkbox group">
        <CheckboxGroup
          bordered
          direction="horizontal"
          items={MOCK_CHECKBOXGROUP_OPTIONS}
        />
      </Field>

      <Field {...args} label="Field with slider">
        <Slider />
      </Field>
    </Stack>
  ),
} satisfies Meta<FieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Field" };
