import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tabs } from "@uiid/design-system";
import { MOCK_TABS } from "./tabs.mocks";

const meta: Meta<typeof Tabs> = {
  title: "Interactive/Tabs",
  component: Tabs,
  tags: ["new"],
  args: {
    items: MOCK_TABS,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    fullwidth: { control: "boolean" },
    ghost: { control: "boolean" },
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

export const Small: Story = {
  name: "Small",
  args: { size: "sm" },
};

export const Large: Story = {
  name: "Large",
  args: { size: "lg" },
};

export const Ghost: Story = {
  name: "Ghost",
  args: { ghost: true },
};
