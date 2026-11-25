import type { Meta, StoryObj } from "@storybook/react-vite";

import * as Examples from "../../../../packages/interactive/src/resizable/resizable.examples";

const meta = {
  title: "Interactive/Resizable",
  tags: ["new"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Resizable",
  render: () => <Examples.Default />,
};

export const Vertical: Story = { render: () => <Examples.Vertical /> };

export const Constraints: Story = { render: () => <Examples.Constraints /> };

export const Nested: Story = { render: () => <Examples.Nested /> };

export const WithoutGrip: Story = { render: () => <Examples.WithoutGrip /> };

/* A disabled handle cannot be dragged and Tab skips it. */
export const Disabled: Story = { render: () => <Examples.Disabled /> };

export const Layout: Story = { render: () => <Examples.Layout /> };
