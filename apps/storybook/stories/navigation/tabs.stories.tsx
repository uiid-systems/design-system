import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tabs } from "@uiid/design-system";

import { MOCK_TABS } from "./tabs.mocks";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["new"],
  args: {
    items: MOCK_TABS,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xsmall", "small", "medium", "large"],
    },
    fullwidth: { control: "boolean" },
    variant: {
      control: "select",
      options: ["ghost"],
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

export const Small: Story = {
  name: "Small",
  args: { size: "small" },
};

export const Large: Story = {
  name: "Large",
  args: { size: "large" },
};

export const Ghost: Story = {
  name: "Ghost",
  args: { variant: "ghost" },
};
