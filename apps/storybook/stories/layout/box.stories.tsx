import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@uiid/design-system";
import * as Examples from "../../../../packages/layout/src/box/box.examples";

import { boxControls } from "./constants";

const meta = {
  title: "Layout/Box",
  component: Box,
  tags: ["beta"],
  args: { h: 64, w: 64, bordered: true, rounded: true },
  argTypes: {
    ...boxControls,
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Box {...args} />,
};

export const Centered: Story = {
  render: () => <Examples.Centered />,
};

export const WithSpacing: Story = {
  render: () => <Examples.WithSpacing />,
};

export const Polymorphic: Story = {
  render: () => <Examples.Polymorphic />,
};
