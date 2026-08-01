import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group } from "@uiid/design-system";

import * as Examples from "../../../../packages/layout/src/group/group.examples";
import { ExampleBox, boxControls, EXAMPLE_LAYOUT_GAP } from "./constants";

const meta = {
  title: "Layout/Group",
  component: Group,
  args: { gap: EXAMPLE_LAYOUT_GAP },
  argTypes: boxControls,
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Group {...args}>
      <ExampleBox bg="tomato" />
      <ExampleBox bg="gold" />
      <ExampleBox bg="dodgerblue" />
    </Group>
  ),
};

export const Centered: Story = {
  render: () => <Examples.Centered />,
};

export const Evenly: Story = {
  render: () => <Examples.Evenly />,
};

export const Polymorphic: Story = {
  render: () => <Examples.Polymorphic />,
};
