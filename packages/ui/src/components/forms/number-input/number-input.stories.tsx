import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/primitives";

import { NumberInput } from "./number-input";

const meta = {
  title: "Forms/Inputs/Number Input",
  component: NumberInput,
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: () => (
    <Stack ax="stretch" gap={4}>
      <NumberInput />
    </Stack>
  ),
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Number Input" };
