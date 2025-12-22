import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Input } from "../input/input";
import { Select } from "../select/select";
import { MOCK_SELECT_ITEMS } from "../select/select.mocks";
import { RadioGroup } from "../radio-group/radio-group";
import { MOCK_RADIOGROUP_OPTIONS } from "../radio-group/radio-group.mocks";

import { Field } from "./field";
import type { FieldProps } from "./field.types";

const meta = {
  title: "Forms/Field",
  component: Field,
  args: {
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    error: "This field is required.",
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Field {...args} label="Field with input">
        <Input />
      </Field>

      <Field {...args} label="Field with select">
        <Select items={MOCK_SELECT_ITEMS} />
      </Field>

      <Field {...args} label="Field with radio group">
        <RadioGroup bordered axis="x" options={MOCK_RADIOGROUP_OPTIONS} />
      </Field>
    </Stack>
  ),
} satisfies Meta<FieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Field" };
