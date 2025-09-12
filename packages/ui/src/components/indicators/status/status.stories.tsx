import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Status } from "./status";

const meta = {
  title: "Components/Indicators/Status",
  component: Status,
  args: {},
  render: (args) => (
    <Stack gap={8}>
      <Status {...args}>Status</Status>
    </Stack>
  ),
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Status" };
