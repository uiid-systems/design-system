import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchRender } from "@uiid/design-system";
import * as Examples from "../../../../packages/layout/src/switch-render/switch-render.examples";

import { ExampleBox, disabledControls } from "./constants";

const meta = {
  title: "Layout/Switch Render",
  component: SwitchRender,
  args: {
    condition: true,
    render: {
      true: <ExampleBox bg="mediumseagreen" />,
      false: <ExampleBox bg="tomato" />,
    },
  },
  argTypes: {
    condition: { control: "boolean" },
    ...disabledControls,
    render: { control: false },
  },
} satisfies Meta<typeof SwitchRender>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <SwitchRender {...args}>Children content</SwitchRender>,
};

export const TrueBranch: Story = {
  render: () => <Examples.TrueBranch />,
};

export const FalseBranch: Story = {
  render: () => <Examples.FalseBranch />,
};

export const Orientation: Story = {
  render: () => <Examples.Orientation />,
};
