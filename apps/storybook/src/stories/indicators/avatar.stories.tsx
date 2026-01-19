import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { Avatar } from "@uiid/indicators";

const meta: Meta<typeof Avatar> = {
  title: "Indicators/Avatar",
  component: Avatar,
  tags: ["beta"],
  args: {},
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={8}>
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

      <Stack gap={4}>
        <Avatar
          {...args}
          initials="AF"
          name="Adam Fratino"
          description="Software Engineer"
          orientation="vertical"
        />
        <Avatar
          {...args}
          initials="AF"
          name="Adam Fratino"
          orientation="vertical"
        />
        <Avatar {...args} initials="AF" orientation="vertical" />
      </Stack>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Avatar" };
