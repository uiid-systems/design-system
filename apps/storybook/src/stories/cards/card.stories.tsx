import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { Card } from "@uiid/cards";

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
    tone: {
      control: "select",
      options: ["info", "warning", "negative", "positive"],
      table: { category: "Variants" },
    },

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
      <Card {...args} tone="info" title="Info card" />
      <Card {...args} tone="warning" title="Warning card" />
      <Card {...args} tone="negative" title="Negative card" />
      <Card {...args} tone="positive" title="Positive card" />
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
