import type { Meta, StoryObj } from "@storybook/react-vite";
import { Shimmer } from "@uiid/design-system";

import * as Examples from "../../../../packages/typography/src/shimmer/shimmer.examples";
import {
  variantControls,
  spacingControls,
  disabledControls,
} from "./constants";

const meta = {
  title: "Typography/Shimmer",
  component: Shimmer,
  args: {
    children: "Thinking…",
    size: 1,
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    duration: { control: "number", table: { category: "Animation" } },
    spread: { control: "number", table: { category: "Animation" } },
    ...variantControls,
    ...spacingControls,
    ...disabledControls,
  },
} satisfies Meta<typeof Shimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const Sizes: Story = {
  render: () => <Examples.Sizes />,
};

export const Color: Story = {
  render: () => <Examples.Color />,
};

export const DurationAndSpread: Story = {
  render: () => <Examples.DurationAndSpread />,
};
