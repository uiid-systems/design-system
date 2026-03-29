import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Timeline } from "./timeline";
import { MOCK_TIMELINE_ITEMS } from "./timeline.mocks";
import type { TimelineItemType } from "./timeline.types";

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
    color: {
      control: "select",
      options: [
        undefined,
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "neutral",
      ],
      table: { category: "Variants" },
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

const COLORED_ITEMS: TimelineItemType[] = [
  { title: "Created", description: "Issue opened", time: "9:00 AM", color: "blue" },
  { title: "In Progress", description: "Work started", time: "10:30 AM", color: "orange" },
  { title: "Review", description: "PR submitted", time: "2:00 PM", color: "purple" },
  { title: "Done", description: "Merged to main", time: "4:30 PM", color: "green" },
];

export const PerItemColors: Story = {
  name: "Per-item colors",
  render: (args) => (
    <Timeline orientation="vertical" items={COLORED_ITEMS} activeIndex={2} {...args} />
  ),
};
