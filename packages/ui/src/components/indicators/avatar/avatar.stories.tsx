import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/primitives";

import { Avatar } from "./avatar";

const meta = {
  title: "Components/Indicators/Avatar",
  component: Avatar,
  args: {},
  render: (args) => (
    <Stack gap={8}>
      <Avatar
        initials="AF"
        name="Adam Fratino"
        description="Software Engineer"
        {...args}
      />
    </Stack>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Avatar" };
