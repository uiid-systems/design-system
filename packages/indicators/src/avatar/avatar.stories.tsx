import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Indicators/Avatar",
  component: Avatar,
  tags: ["beta"],
  args: {},
  render: (args) => (
    <Stack gap={4}>
      <Avatar
        {...args}
        initials="AF"
        name="Adam Fratino"
        description="Software Engineer"
      />

      <Avatar {...args} initials="AF" name="Adam Fratino" />

      <Avatar {...args} initials="AF" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Avatar" };
