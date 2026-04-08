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
    <Stack gap={4} style={{ maxWidth: "32rem" }}>
      <Card
        {...args}
        title="Card title"
        description={
          <>
            Card description can be a <code>string</code> or a{" "}
            <code>ReactNode</code>.
          </>
        }
        icon={Globe}
        action={<a href="#">Card action</a>}
        footer="Card footer"
      />
      <Card
        {...args}
        inverted
        icon={Globe}
        title="Inverted card with custom icon"
      />
    </Stack>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };

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
