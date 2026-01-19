import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Timeline } from "@uiid/indicators";

const MOCK_TIMELINE_ITEMS = [
  {
    title: "Order placed",
    description: "Your order has been confirmed",
    time: "9:00 AM",
  },
  {
    title: "Processing",
    description: "Your order is being prepared",
    time: "10:30 AM",
  },
  {
    title: "Shipped",
    description: "Your order is on the way",
    time: "2:00 PM",
  },
  {
    title: "Delivered",
    description: "Package arrived at destination",
    time: "4:30 PM",
  },
];

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
