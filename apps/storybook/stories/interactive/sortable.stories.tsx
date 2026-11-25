import type { Meta, StoryObj } from "@storybook/react-vite";

import * as Examples from "../../../../packages/interactive/src/sortable/sortable.examples";

const meta = {
  title: "Interactive/Sortable",
  tags: ["new"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* Drag the grip, or focus it and use Space and the arrow keys. */
export const Default: Story = {
  name: "Sortable",
  render: () => <Examples.Default />,
};

export const Horizontal: Story = { render: () => <Examples.Horizontal /> };

export const Grid: Story = { render: () => <Examples.Grid /> };

export const Disabled: Story = { render: () => <Examples.Disabled /> };

export const Overlay: Story = { render: () => <Examples.Overlay /> };

export const Strings: Story = { render: () => <Examples.Strings /> };
