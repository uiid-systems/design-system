import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Tabs } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Interactive/Tabs",
  component: Tabs,
  args: {
    items: [
      { label: "Tab 1", value: "tab-1", render: <p>Tab 1</p> },
      { label: "Tab 2", value: "tab-2", render: <p>Tab 2</p> },
      { label: "Tab 3", value: "tab-3", render: <p>Tab 3</p> },
    ],
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
