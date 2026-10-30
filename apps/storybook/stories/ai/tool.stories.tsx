import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tool } from "@uiid/ai";

import * as Examples from "../../../../packages/ai/src/tool/tool.examples";

const meta = {
  title: "AI/Tool",
  component: Tool,
  args: {
    part: {
      type: "tool-search",
      state: "output-available",
      input: { query: "weather in Lisbon", units: "celsius" },
      output: { temperature: 21, condition: "Clear", wind: "12 km/h NW" },
    },
    defaultOpen: false,
    b: 1,
  },
  argTypes: {
    part: { control: "object", table: { category: "Content" } },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    disabled: { control: "boolean", table: { category: "State" } },
    b: { control: "number", table: { category: "Border" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Tool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const States: Story = {
  render: () => <Examples.States />,
};

export const Lifecycle: Story = {
  render: () => <Examples.Lifecycle />,
};

export const InMessage: Story = {
  render: () => <Examples.InMessage />,
};
