import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

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

      <NumberInput
        step={10}
        label="Step 10"
        description="Number will adjust by 10 on each click"
      />

      <NumberInput
        min={-25}
        max={25}
        step={5}
        label="Min -25, Max 25"
        description="Number will not adjust if it lands out of range"
      />

      <NumberInput
        defaultValue={10}
        label="Default 10"
        description="Number will start at 10"
      />
    </Stack>
  ),
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Number Input" };
