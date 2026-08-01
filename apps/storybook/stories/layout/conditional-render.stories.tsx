import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConditionalRender } from "@uiid/design-system";

import * as Examples from "../../../../packages/layout/src/conditional-render/conditional-render.examples";
import { ExampleBox, disabledControls } from "./constants";

const meta = {
  title: "Layout/Conditional Render",
  component: ConditionalRender,
  args: {
    condition: true,
    render: <ExampleBox bg="gold" />,
  },
  argTypes: {
    condition: { control: "boolean" },
    ...disabledControls,
    render: { control: false },
  },
} satisfies Meta<typeof ConditionalRender>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ConditionalRender {...args}>Children content</ConditionalRender>
  ),
};

export const Wrapped: Story = {
  render: () => <Examples.Wrapped />,
};

export const Unwrapped: Story = {
  render: () => <Examples.Unwrapped />,
};

export const ConditionalLink: Story = {
  render: () => <Examples.ConditionalLink />,
};
