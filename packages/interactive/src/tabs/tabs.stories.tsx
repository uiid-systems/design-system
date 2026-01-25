import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Tabs } from "./tabs";
import { MOCK_TABS } from "./tabs.mocks";

const meta: Meta<typeof Tabs> = {
  title: "Interactive/Tabs",
  component: Tabs,
  tags: ["danger"],
  args: {
    items: MOCK_TABS,
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    evenly: {
      control: "boolean",
    },
  },
  render: (args) => (
    <Stack fullwidth ax="stretch" gap={4}>
      <Tabs {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tabs" };

export const AlignStart: Story = {
  name: "Align Start",
  args: { align: "start" },
};

export const AlignCenter: Story = {
  name: "Align Center",
  args: { align: "center" },
};

export const AlignEnd: Story = {
  name: "Align End",
  args: { align: "end" },
};
