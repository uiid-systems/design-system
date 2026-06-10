import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@uiid/design-system";
import * as Examples from "../../../../packages/typography/src/text/text.examples";

import { textControls } from "./constants";

const meta = {
  title: "Typography/Text",
  component: Text,
  tags: ["beta"],
  args: {
    children:
      "The quick brown fox jumps over the lazy dog — 1234567890",
    size: 1,
  },
  argTypes: textControls,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Text {...args} />,
};

export const Scale: Story = {
  render: () => <Examples.Scale />,
};

export const Weights: Story = {
  render: () => <Examples.Weights />,
};

export const Families: Story = {
  render: () => <Examples.Families />,
};

export const Shades: Story = {
  render: () => <Examples.Shades />,
};

export const Colors: Story = {
  render: () => <Examples.Colors />,
};

export const Truncate: Story = {
  render: () => <Examples.Truncate />,
};

export const Balance: Story = {
  render: () => <Examples.Balance />,
};

export const InlineCode: Story = {
  render: () => <Examples.InlineCode />,
};

export const Polymorphic: Story = {
  render: () => <Examples.Polymorphic />,
};
