import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Tabs, type TabsProps } from "@uiid/interactive";

const MOCK_TABS: TabsProps["items"] = [
  { value: "tab1", label: "Tab 1", content: "Content for Tab 1" },
  { value: "tab2", label: "Tab 2", content: "Content for Tab 2" },
  { value: "tab3", label: "Tab 3", content: "Content for Tab 3" },
];

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
