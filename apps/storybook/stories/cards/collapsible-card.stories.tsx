import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapsibleCard } from "@uiid/design-system";

import * as Examples from "../../../../packages/cards/src/collapsible-card/collapsible-card.examples";

const meta = {
  title: "Cards/CollapsibleCard",
  component: CollapsibleCard,
  args: {
    title: "Collapsible card",
    description: "The header stays in view while the body collapses.",
    defaultOpen: true,
    disabled: false,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    children: { control: "text", table: { category: "Content" } },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    open: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onOpenChange: { table: { category: "State" } },
    HeaderProps: { table: { category: "Subcomponents" } },
    TitleProps: { table: { category: "Subcomponents" } },
    DescriptionProps: { table: { category: "Subcomponents" } },
    ActionProps: { table: { category: "Subcomponents" } },
    FooterProps: { table: { category: "Subcomponents" } },
    ThumbnailProps: { table: { category: "Subcomponents" } },
    InnerContainerProps: { table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof CollapsibleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <CollapsibleCard {...args} maxw={420} />,
};

export const DefaultOpen: Story = {
  render: () => <Examples.DefaultOpen />,
};

export const FullHeader: Story = {
  render: () => <Examples.FullHeader />,
};

export const Controlled: Story = {
  render: () => <Examples.Controlled />,
};

export const Stacked: Story = {
  render: () => <Examples.Stacked />,
};
