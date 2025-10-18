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
    size: { control: "select", options: ["sm", "md", "lg"] },
    fill: { control: "select", options: ["solid", "outline", "ghost"] },
    shape: { control: "select", options: ["rounded", "pill"] },
    loadingText: { control: "text" },
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
        <CloseButton {...args}>Close</CloseButton>
        <CloseButton {...args} iconPosition="after">
          Close
        </CloseButton>
      </Stack>
    );
  },
};
