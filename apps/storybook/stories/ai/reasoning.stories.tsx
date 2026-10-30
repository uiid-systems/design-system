import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reasoning } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/reasoning/reasoning.examples";

const meta = {
  title: "AI/Reasoning",
  component: Reasoning,
  args: {
    children:
      "The user wants the difference between the two layouts, not a tour of the props.\n\n1. Name the one attribute that drives both\n2. Show each layout in a sentence",
    streaming: false,
    duration: 4,
    defaultOpen: false,
    gap: 2,
  },
  argTypes: {
    streaming: { control: "boolean", table: { category: "Streaming" } },
    duration: { control: "number", table: { category: "Streaming" } },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    disabled: { control: "boolean", table: { category: "State" } },
    gap: { control: "number", table: { category: "Spacing" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { control: "text", table: { category: "Content" } },
  },
} satisfies Meta<typeof Reasoning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const Streaming: Story = {
  render: () => <Examples.Streaming />,
};

export const InMessage: Story = {
  render: () => <Examples.InMessage />,
};
