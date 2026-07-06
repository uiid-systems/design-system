import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Card } from "@uiid/design-system";
import * as Examples from "../../../../packages/cards/src/card/card.examples";

const meta = {
  title: "Cards/Card",
  component: Card,
  args: {
    title: "Card title",
    description: "A short supporting description that sits beneath the title.",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: Globe,
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    children: { control: "text", table: { category: "Content" } },
    HeaderProps: { table: { category: "Subcomponents" } },
    TitleProps: { table: { category: "Subcomponents" } },
    DescriptionProps: { table: { category: "Subcomponents" } },
    IconProps: { table: { category: "Subcomponents" } },
    ActionProps: { table: { category: "Subcomponents" } },
    FooterProps: { table: { category: "Subcomponents" } },
    ThumbnailProps: { table: { category: "Subcomponents" } },
    InnerContainerProps: { table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Card {...args} maxw={420} />,
};

export const HeaderVariants: Story = {
  render: () => <Examples.HeaderVariants />,
};

export const Thumbnail: Story = {
  render: () => <Examples.Thumbnail />,
};

export const Footer: Story = {
  render: () => <Examples.Footer />,
};

export const Trimmed: Story = {
  render: () => <Examples.Trimmed />,
};

export const ColorSurfaces: Story = {
  render: () => <Examples.ColorSurfaces />,
};

export const Polymorphic: Story = {
  render: () => <Examples.Polymorphic />,
};
