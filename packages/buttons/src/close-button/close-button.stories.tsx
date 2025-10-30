import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Stack } from "@uiid/layout";

import { CloseButton } from "./close-button";

const meta = {
  title: "Buttons/Close Button",
  component: CloseButton,
  args: {
    onClick: fn(),
  },
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Close Button",
  render: (args) => {
    return (
      <Stack gap={4}>
        <CloseButton {...args} />
      </Stack>
    );
  },
};
