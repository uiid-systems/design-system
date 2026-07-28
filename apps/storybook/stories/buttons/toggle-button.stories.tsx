import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heart } from "@uiid/icons";
import { ToggleButton } from "@uiid/design-system";

import * as Examples from "../../../../packages/buttons/src/toggle-button/toggle-button.examples";

const meta = {
  title: "Buttons/Toggle Button",
  component: ToggleButton,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    children: "Favorite",
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    defaultPressed: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["subtle", "ghost"],
      table: { category: "Variants" },
    },
    shape: {
      control: "select",
      options: ["pill", "square", "circle"],
      table: { category: "Variants" },
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ToggleButton
      {...args}
      icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
    />
  ),
};

export const Pressed: Story = { render: () => <Examples.Pressed /> };
export const DynamicIcon: Story = { render: () => <Examples.DynamicIcon /> };
export const DynamicText: Story = { render: () => <Examples.DynamicText /> };
export const IconAndText: Story = { render: () => <Examples.IconAndText /> };
