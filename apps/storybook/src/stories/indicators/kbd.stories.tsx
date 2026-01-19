import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { Kbd, KbdGroup } from "@uiid/indicators";

const meta = {
  title: "Indicators/Kbd",
  component: Kbd,
  tags: ["danger"],
  args: {},
  render: () => (
    <Stack gap={8}>
      <Kbd>⌘ + B</Kbd>
      <KbdGroup>
        <Kbd>⌘ + C</Kbd>
        <Kbd>⌘ + V</Kbd>
      </KbdGroup>
    </Stack>
  ),
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Kbd" };
