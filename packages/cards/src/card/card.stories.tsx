import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { Card } from "./card";

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
