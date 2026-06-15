import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CodeBlock, Stack, Text, Timeline } from "@uiid/design-system";
import type { TimelineItemType } from "@uiid/design-system";
import { MOCK_TIMELINE_ITEMS } from "./timeline.mocks";

const meta = {
  title: "Indicators/Timeline",
  component: Timeline,
  tags: ["beta"],
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
  {
    title: "Created",
    description: "Issue opened",
    time: "9:00 AM",
    color: "blue",
  },
  {
    title: "In Progress",
    description: "Work started",
    time: "10:30 AM",
    color: "orange",
  },
  {
    title: "Review",
    description: "PR submitted",
    time: "2:00 PM",
    color: "purple",
  },
  {
    title: "Done",
    description: "Merged to main",
    time: "4:30 PM",
    color: "green",
  },
];

export const PerItemColors: Story = {
  name: "Per-item colors",
  render: (args) => (
    <Timeline
      orientation="vertical"
      items={COLORED_ITEMS}
      activeIndex={3}
      {...args}
    />
  ),
};

const sampleCode = `export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}`;

const recapText =
  "Reworked the timeline content card to honor the slot width. The previous layout shrank to its content because Stack defaults to inline-flex with `align-items: flex-start`; without `fullwidth` on both the wrapping Stack and the Card, the Card sizes to its longest child (a code line, typically) instead of the slot.";

export const ComplexCard: Story = {
  name: "Card content (pitfall: no fullwidth)",
  render: () => (
    <Timeline
      ContentProps={{ maxw: 720 }}
      activeIndex={1}
      items={[
        {
          title: "Session recap",
          time: "9:00 AM",
          content: (
            <Card InnerContainerProps={{ gap: 4 }}>
              <Text>{recapText}</Text>
              <CodeBlock
                code={sampleCode}
                language="typescript"
                filename="counter.tsx"
              />
            </Card>
          ),
        },
        {
          title: "Next event",
          time: "9:15 AM",
        },
      ]}
    />
  ),
};
