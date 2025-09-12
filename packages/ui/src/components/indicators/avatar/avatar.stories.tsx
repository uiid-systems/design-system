import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Avatar } from "./avatar";

const meta = {
  title: "Indicators/Avatar",
  component: Avatar,
  args: {},
  render: (args) => (
    <Stack gap={8}>
      <Avatar
        {...args}
        initials="AF"
        name="Adam Fratino"
        description="Software Engineer"
      />
    </Stack>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Avatar" };
