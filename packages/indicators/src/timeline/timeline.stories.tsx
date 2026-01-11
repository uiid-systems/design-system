import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Timeline } from "./timeline";
import { MOCK_TIMELINE_ITEMS } from "./timeline.mocks";

const meta = {
  title: "Indicators/Timeline",
  component: Timeline,
  tags: ["new"],
  args: {
    activeIndex: 1,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { category: "Options" },
    },
    activeIndex: {
      control: { type: "number", min: 0, max: 3 },
      table: { category: "Options" },
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
      table: { category: "Options" },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Timeline",
  render: (args) => (
    <Stack gap={8}>
      <Timeline orientation="vertical" items={MOCK_TIMELINE_ITEMS} {...args} />
      <Timeline
        orientation="horizontal"
        items={MOCK_TIMELINE_ITEMS}
        {...args}
      />
    </Stack>
  ),
};
