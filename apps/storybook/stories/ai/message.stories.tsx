import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/message/message.examples";

const meta = {
  title: "AI/Message",
  component: Message,
  args: {
    from: "assistant",
    gap: 2,
  },
  argTypes: {
    from: {
      control: "select",
      options: ["user", "assistant", "system"],
      table: { category: "Layout" },
    },
    gap: { control: "number", table: { category: "Spacing" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const UserAndAssistant: Story = {
  render: () => <Examples.UserAndAssistant />,
};

export const Streaming: Story = {
  render: () => <Examples.Streaming />,
};

export const WithActions: Story = {
  render: () => <Examples.WithActions />,
};

export const WithConversation: Story = {
  render: () => <Examples.WithConversation />,
};
