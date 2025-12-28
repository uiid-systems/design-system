import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "../";

import { Separator } from "./separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  args: {},
  render: (args) => (
    <Stack gap={2}>
      <Stack gap={2}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <Separator {...args} />
        <div style={{ background: "gold", height: 64, width: 64 }} />
      </Stack>

      <Group gap={2}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <Separator {...args} orientation="vertical" />
        <div style={{ background: "gold", height: 64, width: 64 }} />
      </Group>
    </Stack>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Separator" };
