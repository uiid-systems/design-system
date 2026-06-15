import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Stack, Card } from "@uiid/design-system";

const meta = {
  title: "Cards/Card",
  component: Card,
  tags: ["beta"],
  args: {
    title: "Card Title",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  argTypes: {
    title: {
      control: "text",
      table: { category: "Text" },
    },
    description: {
      control: "text",
      table: { category: "Text" },
    },
    footer: {
      table: { category: "Content" },
    },

    HeaderProps: { table: { category: "Subcomponents" } },
    TitleProps: { table: { category: "Subcomponents" } },
    DescriptionProps: { table: { category: "Subcomponents" } },
    IconProps: { table: { category: "Subcomponents" } },
    FooterProps: { table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Card
      {...args}
      maxw={480}
      title="Card title"
      description="This is the card description"
      icon={Globe}
      action={<button>Card action</button>}
      footer="Card footer"
    />
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };

const HEADER_VARIANTS = [
  { label: "No header", props: {} },
  { label: "Title only", props: { title: "Title only" } },
  { label: "Description only", props: { description: "Description only" } },
  {
    label: "Title + description",
    props: { title: "Title", description: "And a description" },
  },
  { label: "Icon only", props: { icon: Globe } },
  { label: "Icon + title", props: { icon: Globe, title: "Icon + title" } },
  {
    label: "Action only",
    props: { action: <button>Action</button> },
  },
  {
    label: "Title + action",
    props: { title: "Title + action", action: <button>Action</button> },
  },
  {
    label: "Icon + title + action",
    props: {
      icon: Globe,
      title: "Icon + title + action",
      action: <button>Action</button>,
    },
  },
  {
    label: "Full header",
    props: {
      icon: Globe,
      title: "Full header",
      description: "Icon, title, description, and action all present",
      action: <button>Action</button>,
    },
  },
] as const;

export const HeaderVariants: Story = {
  name: "Header Variants",
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack gap={4} style={{ maxWidth: "30rem" }}>
      {HEADER_VARIANTS.map((v) => (
        <Card key={v.label} {...v.props}>
          {`Body for: ${v.label}`}
        </Card>
      ))}
    </Stack>
  ),
};

export const HeaderVariantsNoBody: Story = {
  name: "Header Variants (no body)",
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack gap={4} style={{ maxWidth: "30rem" }}>
      {HEADER_VARIANTS.map((v) => (
        <Card key={v.label} {...v.props} />
      ))}
    </Stack>
  ),
};

const PlaceholderThumbnail = () => (
  <svg
    viewBox="0 0 300 300"
    fill="none"
    style={{ width: "100%", height: "auto", display: "block" }}
  >
    <rect width="300" height="300" rx="12" />
    <rect
      x="40"
      y="44"
      width="220"
      height="56"
      rx="12"
      fill="var(--theme-primary)"
    />
    <rect
      x="100"
      y="62"
      width="100"
      height="20"
      rx="6"
      fill="var(--shade-background)"
      opacity="0.9"
    />
    <rect
      x="40"
      y="120"
      width="220"
      height="56"
      rx="12"
      fill="var(--theme-secondary)"
    />
    <rect
      x="100"
      y="138"
      width="100"
      height="20"
      rx="6"
      fill="var(--shade-background)"
      opacity="0.9"
    />
    <rect
      x="40"
      y="196"
      width="220"
      height="56"
      rx="12"
      fill="var(--shade-foreground)"
    />
    <rect
      x="100"
      y="214"
      width="100"
      height="20"
      rx="6"
      fill="var(--shade-background)"
      opacity="0.9"
    />
  </svg>
);

export const Thumbnail: Story = {
  name: "Thumbnail",
  render: (args) => (
    <Stack gap={4} style={{ maxWidth: "24rem" }}>
      <Card
        {...args}
        title="Card with thumbnail"
        description="Thumbnail slot renders above the header"
        thumbnail={<PlaceholderThumbnail />}
      />
      <Card
        {...args}
        title="No thumbnail"
        description="Regular card without thumbnail"
      />
    </Stack>
  ),
};
