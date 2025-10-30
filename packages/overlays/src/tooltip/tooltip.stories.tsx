import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    children: "This is a tooltip",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={8}>
      <Tooltip {...args} trigger="tooltip as string" />
      <Tooltip {...args} trigger={<span>tooltip as span</span>} />
      <Tooltip {...args} trigger={<Text>tooltip as text component</Text>} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tooltip" };
