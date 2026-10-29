import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromptInput } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/prompt-input/prompt-input.examples";

const meta = {
  title: "AI/PromptInput",
  component: PromptInput,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    status: "ready",
    placeholder: "Ask anything",
    disabled: false,
  },
  argTypes: {
    status: {
      control: "select",
      options: ["ready", "submitted", "streaming", "error"],
      table: { category: "State" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    placeholder: { control: "text", table: { category: "Text" } },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["ghost"],
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
    onSubmit: { table: { disable: true } },
    onStop: { table: { disable: true } },
    header: { table: { disable: true } },
    tools: { table: { disable: true } },
    ref: { table: { disable: true } },
    className: { table: { disable: true } },
    FieldProps: { table: { disable: true } },
  },
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const WithHeader: Story = {
  render: () => <Examples.WithHeader />,
};

export const WithTools: Story = {
  render: () => <Examples.WithTools />,
};

export const Statuses: Story = {
  render: () => <Examples.Statuses />,
};

export const Controlled: Story = {
  render: () => <Examples.Controlled />,
};

export const Disabled: Story = {
  render: () => <Examples.Disabled />,
};

export const WithConversation: Story = {
  render: () => <Examples.WithConversation />,
};
