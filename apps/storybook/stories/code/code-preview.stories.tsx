import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodePreview } from "@uiid/design-system";

import * as Examples from "../../../../packages/code/src/code-preview/code-preview.examples";

const meta = {
  title: "Code/Code Preview",
  component: CodePreview,
  tags: ["beta"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    showLineNumbers: { control: "boolean" },
    copyable: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<typeof CodePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Closed by default: the example on top, "Show code" and copy beneath it. */
export const Default: Story = {
  render: () => <Examples.Default />,
};

export const OpenByDefault: Story = {
  render: () => <Examples.OpenByDefault />,
};

/* No `code`: a framed canvas with no bar and no panel. */
export const NoCode: Story = {
  render: () => <Examples.NoCode />,
};

/* A 40-line file opens in full. */
export const LongCode: Story = {
  render: () => <Examples.LongCode />,
};

export const Labels: Story = {
  render: () => <Examples.Labels />,
};

export const Controlled: Story = {
  render: () => <Examples.Controlled />,
};

/* The exported parts under a CollapsibleRoot, without CodePreview's frame. */
export const Composed: Story = {
  render: () => <Examples.Composed />,
};
