import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import {
  Input,
  Select,
  RadioGroup,
  CheckboxGroup,
  NumberField,
  Combobox,
  Autocomplete,
  Slider,
  Switch,
  Textarea,
  Field,
  type FieldProps,
  type SelectProps,
  type FormItemProps,
  type ComboboxProps,
} from "@uiid/forms";

const MOCK_SELECT_ITEMS: SelectProps["items"] = [
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
  { value: "display", label: "Display" },
];

const MOCK_RADIOGROUP_OPTIONS: FormItemProps[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3", disabled: true },
];

const MOCK_CHECKBOXGROUP_OPTIONS: FormItemProps[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3", disabled: true },
];

const MOCK_COMBOBOX_ITEMS: ComboboxProps["items"] = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
];

const MOCK_AUTOCOMPLETE_ITEMS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
];

const meta = {
  title: "Forms/Field",
  component: Field,
  tags: ["beta"],
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

      <Field {...args} label="Field with switch">
        <Switch bordered label="Switch" />
      </Field>

      <Field {...args} label="Field with textarea">
        <Textarea placeholder="Type something..." />
      </Field>
    </Stack>
  ),
} satisfies Meta<FieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Field" };
