import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Stack } from "@uiid/layout";

import { ResetButton } from "./reset-button";

const meta = {
  title: "Buttons/Reset Button",
  component: ResetButton,
  args: {
    onClick: fn(),
  },
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ResetButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Reset Button",
  render: (args) => {
    return (
      <Stack gap={4}>
        <ResetButton {...args} />
      </Stack>
    );
  },
};
