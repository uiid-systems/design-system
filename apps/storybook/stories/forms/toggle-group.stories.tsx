import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle, ToggleGroup } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/toggle-group/toggle-group.examples";

const meta = {
  title: "Forms/Toggle Group",
  component: ToggleGroup,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    size: "medium",
    defaultValue: ["monthly"],
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["ghost"],
      table: { category: "Variants" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Variants" },
    },

    value: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },

    multiple: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly">Yearly</Toggle>
    </ToggleGroup>
  ),
};

export const WithIcons: Story = { render: () => <Examples.WithIcons /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Vertical: Story = { render: () => <Examples.Vertical /> };
export const Multiple: Story = { render: () => <Examples.Multiple /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
