import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Badge } from "./badge";

const meta = {
  title: "Indicators/Badge",
  component: Badge,
  args: {},
  render: (args) => (
    <Stack gap={8}>
      <Badge {...args}>Badge</Badge>
    </Stack>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Badge" };
