import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { CopyButton } from "./copy-button";

const meta = {
  title: "Buttons/Copy Button",
  component: CopyButton,
  args: {
    clipboardText: "Use the text prop to set the text to copy.",
  },
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Copy Button",
  render: (args) => {
    return (
      <Stack gap={4}>
        <CopyButton {...args} />
        <CopyButton {...args} variant="subtle" />
      </Stack>
    );
  },
};
