import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/design-system";

import * as Examples from "../../../../packages/layout/src/stack/stack.examples";
import { boxControls, EXAMPLE_LAYOUT_GAP } from "./constants";
import { ExampleBox } from "./layout.mocks";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  args: { gap: EXAMPLE_LAYOUT_GAP },
  argTypes: boxControls,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <ExampleBox bg="tomato" />
      <ExampleBox bg="gold" />
      <ExampleBox bg="dodgerblue" />
    </Stack>
  ),
};

export const Stretched: Story = {
  render: () => <Examples.Stretched />,
};

export const Centered: Story = {
  render: () => <Examples.Centered />,
};

export const Polymorphic: Story = {
  render: () => <Examples.Polymorphic />,
};
