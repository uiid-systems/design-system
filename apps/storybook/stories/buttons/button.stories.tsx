import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobeIcon } from "@uiid/icons";
import { Button } from "@uiid/design-system";

import * as Examples from "../../../../packages/buttons/src/button/button.examples";

const meta = {
  title: "Buttons/Button",
  component: Button,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    children: "Travel the world",
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    tooltip: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    loading: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["subtle", "ghost", "inverted"],
      table: { category: "Variants" },
    },
    shape: {
      control: "select",
      options: ["pill", "square", "circle"],
      table: { category: "Variants" },
    },
    onClick: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Button {...args}>
      <GlobeIcon />
      {args.children}
    </Button>
  ),
};

export const Variants: Story = { render: () => <Examples.Variants /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Shapes: Story = { render: () => <Examples.Shapes /> };
export const WithIcon: Story = { render: () => <Examples.WithIcon /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Loading: Story = { render: () => <Examples.Loading /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const WithTooltip: Story = { render: () => <Examples.WithTooltip /> };
export const Polymorphic: Story = { render: () => <Examples.Polymorphic /> };
