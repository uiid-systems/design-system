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
  argTypes: {},
  render: (args) => (
    <Stack fullwidth ax="stretch" gap={4}>
      <Tabs {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tabs" };
