import type { Meta, StoryObj } from "@storybook/react-vite";
import { Conversation } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/conversation/conversation.examples";

const meta = {
  title: "AI/Conversation",
  component: Conversation,
  args: {
    h: 360,
  },
  argTypes: {
    h: { control: "number", table: { category: "Sizing" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Conversation>;

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

export const EmptyState: Story = {
  render: () => <Examples.EmptyState />,
};
