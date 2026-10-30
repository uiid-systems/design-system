import type { Meta, StoryObj } from "@storybook/react-vite";
import { Suggestion } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/suggestion/suggestion.examples";

const meta = {
  title: "AI/Suggestion",
  component: Suggestion,
  args: {
    variant: "subtle",
    shape: "pill",
    size: "small",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["subtle", "ghost"],
      table: { category: "Variants" },
    },
    shape: {
      control: "select",
      options: ["pill", "square", "circle"],
      table: { category: "Variants" },
    },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    color: {
      control: "select",
      options: [
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
    disabled: { control: "boolean", table: { category: "State" } },
    onClick: { table: { disable: true } },
    tooltip: { table: { disable: true } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Suggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const WithEmptyState: Story = {
  render: () => <Examples.WithEmptyState />,
};
