import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  Card,
  CodeBlock,
  Stack,
  Text,
  Timeline,
  TimelineItem,
} from "@uiid/design-system";
import type { TimelineItemType } from "@uiid/design-system";
import {
  CreditCard,
  GitCommitHorizontal,
  GitMerge,
  MapPin,
  MessageSquare,
  Package,
  Play,
  Sparkles,
  Truck,
  UserPlus,
  Wrench,
} from "@uiid/icons";
import { MOCK_TIMELINE_ITEMS } from "./timeline.mocks";

const meta = {
  title: "Indicators/Timeline",
  component: Timeline,
  tags: ["beta"],
  args: {
    activeIndex: 1,
  },
  argTypes: {
    activeIndex: {
      control: { type: "number", min: 0, max: 5 },
      table: { category: "Options" },
    },
    defaultStatus: {
      control: "select",
      options: [undefined, "pending", "active", "completed"],
      table: { category: "Options" },
    },
    gap: {
      control: { type: "number", min: 0, max: 12 },
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
  render: (args) => <Timeline items={MOCK_TIMELINE_ITEMS} {...args} />,
};

const ICON_ITEMS: TimelineItemType[] = [
  {
    title: "Order placed",
    description: "Your order has been confirmed",
    time: "9:00 AM",
    media: <CreditCard size={24} />,
  },
  {
    title: "Processing",
    description: "Your order is being prepared",
    time: "10:30 AM",
    media: <Package size={24} />,
  },
  {
    title: "Shipped",
    description: "Your order is on the way",
    time: "2:00 PM",
    media: <Truck size={24} />,
  },
  {
    title: "Delivered",
    description: "Package arrived at destination",
    time: "4:30 PM",
    media: <MapPin size={24} />,
  },
];

export const IconMedia: Story = {
  name: "Icon media",
  render: (args) => <Timeline items={ICON_ITEMS} activeIndex={2} {...args} />,
};

const AVATAR_ITEMS: TimelineItemType[] = [
  {
    title: "Adam opened the issue",
    description: "Timeline feels limiting in practice",
    time: "Mon 9:00 AM",
    media: <Avatar initials="AF" />,
  },
  {
    title: "Jane left a review",
    description: "The rail alignment looks much better now",
    time: "Mon 2:15 PM",
    media: <Avatar initials="JD" color="purple" />,
  },
  {
    title: "Alex merged the PR",
    description: "Shipped in the next release",
    time: "Tue 11:40 AM",
    media: <Avatar initials="AB" color="green" />,
  },
];

export const AvatarMedia: Story = {
  name: "Avatar media",
  render: (args) => <Timeline items={AVATAR_ITEMS} activeIndex={2} {...args} />,
};

export const PerItemColors: Story = {
  name: "Per-item colors",
  render: (args) => (
    <Timeline
      activeIndex={3}
      items={[
        { title: "Created", description: "Issue opened", color: "blue" },
        { title: "In progress", description: "Work started", color: "orange" },
        { title: "Review", description: "PR submitted", color: "purple" },
        { title: "Done", description: "Merged to main", color: "green" },
      ]}
      {...args}
    />
  ),
};

const sampleCode = `export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}`;

export const CardContent: Story = {
  name: "Card content over the rail",
  render: () => (
    <Timeline activeIndex={1} ContentProps={{ maxw: 640 }}>
      <TimelineItem
        title="Session recap"
        time="9:00 AM"
        media={<Avatar initials="AF" />}
      >
        <Card InnerContainerProps={{ gap: 4 }}>
          <Text>
            The content column stretches by default, so a Card fills the slot
            without any extra <code>fullwidth</code> wiring.
          </Text>
          <CodeBlock
            code={sampleCode}
            language="typescript"
            filename="counter.tsx"
          />
        </Card>
      </TimelineItem>
      <TimelineItem title="Next event" time="9:15 AM" />
    </Timeline>
  ),
};

export const Composition: Story = {
  name: "Composition (advanced)",
  render: (args) => (
    <Timeline activeIndex={1} {...args}>
      <TimelineItem title="Draft" description="Document created" time="Mon" />
      <TimelineItem
        title="In review"
        description="Awaiting approval"
        time="Tue"
      />
      <TimelineItem
        title="Published"
        description="Live for everyone"
        time="Wed"
      />
    </Timeline>
  ),
};

const ACTIVITY_ITEMS: TimelineItemType[] = [
  {
    title: "Adam Fratino opened this pull request",
    description: "feat(ui): rebuild the Timeline component",
    time: "Jun 18",
    color: "blue",
    media: <Avatar initials="AF" color="blue" />,
  },
  {
    title: "Reviewers requested",
    time: "Jun 18",
    media: <UserPlus size={20} />,
    content: (
      <Card p={4}>
        <Stack gap={4}>
          <Avatar
            initials="JD"
            name="Jane Doe"
            description="Senior Engineer"
            color="purple"
          />
          <Avatar
            initials="AB"
            name="Alex Brown"
            description="Design Lead"
            color="green"
          />
        </Stack>
      </Card>
    ),
  },
  {
    title: "Jane Doe requested changes",
    time: "Jun 19",
    color: "orange",
    media: <Avatar initials="JD" color="purple" />,
    content: (
      <Card p={4}>
        <Text>
          The rail looks great. Can we center the avatar on the title line
          rather than top-aligning it? Otherwise this is ready to go.
        </Text>
      </Card>
    ),
  },
  {
    title: "Adam pushed 5 commits",
    description: "Centered media, added a README, removed the legacy store",
    time: "Jun 20",
    media: <GitCommitHorizontal size={20} />,
  },
  {
    title: "Alex Brown approved these changes",
    description: "LGTM — the alignment is much cleaner now",
    time: "Jun 21",
    color: "green",
    media: <Avatar initials="AB" color="green" />,
  },
  {
    title: "Merged into main",
    description: "Adam Fratino merged commit a1b2c3d",
    time: "Jun 23",
    color: "green",
    media: <GitMerge size={20} />,
  },
];

export const ActivityFeed: Story = {
  name: "Activity feed (realistic)",
  args: { activeIndex: 5 },
  render: (args) => (
    <Timeline items={ACTIVITY_ITEMS} ContentProps={{ maxw: 520 }} {...args} />
  ),
};

const FEED_ITEMS: TimelineItemType[] = [
  {
    title: "session started",
    time: "09:00:12",
    color: "orange",
    marker: <Play size={12} />,
    TitleProps: { color: "orange" },
  },
  {
    title: "prompt",
    time: "09:00:41",
    color: "blue",
    marker: <MessageSquare size={12} />,
    TitleProps: { color: "blue" },
    content: (
      <Card p={3}>
        <Text>
          i'd like to have a deep look at our timeline component. it's very
          important to a sibling project, as is it feels stable but raw.
        </Text>
      </Card>
    ),
  },
  {
    title: "tool work",
    description: "25× Read, 3× Bash",
    time: "09:04:02",
    color: "yellow",
    marker: <Wrench size={12} />,
    TitleProps: { color: "yellow" },
  },
  {
    title: "assistant",
    time: "09:06:58",
    color: "indigo",
    marker: <Sparkles size={12} />,
    TitleProps: { color: "indigo" },
    content: (
      <Card p={3}>
        <Text>
          The rail redesign is clear — the grid owns the column tracks and every
          item subgrids them, so the markers stay aligned at any content width.
        </Text>
      </Card>
    ),
  },
];

export const EventFeed: Story = {
  name: "Event feed (markers)",
  args: { activeIndex: undefined },
  render: (args) => (
    <Timeline
      items={FEED_ITEMS}
      defaultStatus="completed"
      gap={4}
      ContentProps={{ maxw: 520 }}
      {...args}
    />
  ),
};

const VARIABLE_MEDIA_ITEMS: TimelineItemType[] = [
  {
    title: "Icon media",
    description: "Narrowest — a bare icon",
    time: "9:00 AM",
    media: <Package size={20} />,
  },
  {
    title: "Avatar circle",
    description: "Just initials",
    time: "9:30 AM",
    media: <Avatar initials="AF" />,
  },
  {
    title: "Avatar with name",
    description: "Circle plus a label",
    time: "10:15 AM",
    media: <Avatar initials="JD" name="Jane Doe" color="purple" />,
  },
  {
    title: "Avatar with name and description",
    description: "The widest media in this list",
    time: "11:40 AM",
    media: (
      <Avatar
        initials="AB"
        name="Alex Brown"
        description="Design Lead"
        color="green"
      />
    ),
  },
];

export const VariableMediaWidths: Story = {
  name: "Variable media widths",
  args: { activeIndex: 3 },
  render: (args) => <Timeline items={VARIABLE_MEDIA_ITEMS} {...args} />,
};
