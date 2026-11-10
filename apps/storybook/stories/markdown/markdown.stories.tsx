import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "@uiid/design-system";

import * as Examples from "../../../../packages/markdown/src/markdown/markdown.examples";

const meta = {
  title: "Markdown/Markdown",
  component: Markdown,
  args: {
    children: "Some **bold**, `inline code` and a [link](https://example.com).",
    streaming: false,
    reveal: false,
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    streaming: { control: "boolean", table: { category: "Streaming" } },
    reveal: { control: "boolean", table: { category: "Streaming" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const Streaming: Story = {
  render: () => <Examples.Streaming />,
};

export const StreamingReveal: Story = {
  render: () => <Examples.StreamingReveal />,
};
