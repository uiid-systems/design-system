import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layer } from "@uiid/design-system";

import * as Examples from "../../../../packages/layout/src/layer/layer.examples";
import { ExampleBox, disabledControls } from "./constants";

const meta = {
  title: "Layout/Layer",
  component: Layer,
  args: { offset: { x: 0, y: 0 } },
  argTypes: {
    offset: {
      control: "object",
      table: { category: "Position" },
    },
    ...disabledControls,
  },
} satisfies Meta<typeof Layer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Layer {...args}>
      <ExampleBox bg="tomato" />
      <ExampleBox bg="gold" />
      <ExampleBox bg="dodgerblue" />
    </Layer>
  ),
};

export const Stacked: Story = {
  render: () => <Examples.Stacked />,
};

export const OffsetX: Story = {
  render: () => <Examples.OffsetX />,
};

export const OffsetY: Story = {
  render: () => <Examples.OffsetY />,
};

export const Diagonal: Story = {
  render: () => <Examples.Diagonal />,
};

export const FragmentChildren: Story = {
  render: () => <Examples.FragmentChildren />,
};

export const ComponentChildren: Story = {
  render: () => <Examples.ComponentChildren />,
};
