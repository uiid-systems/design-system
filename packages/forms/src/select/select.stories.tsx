import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Select } from "./select";
import type { SelectProps } from "./select.types";
import { MOCK_FONTS } from "./select.mocks";

const meta = {
  title: "Forms/Select",
  component: Select,
  args: {
    disabled: false,
    required: false,
    items: MOCK_FONTS,
  },
  argTypes: {
    onValueChange: { action: "onValueChange" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={4}>
      <Select {...args} />

      <Field label="Select font" description="Select a font for your project">
        <Select {...args} />
      </Field>

      <Group fullwidth evenly gap={4}>
        <Select {...args} />
        <Select {...args} />
      </Group>
    </Stack>
  ),
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select" };
