import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/switch/switch.examples";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Enable notifications",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    color: {
      control: "select",
      options: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "neutral",
      ],
      table: { category: "Variants" },
    },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    defaultChecked: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onCheckedChange: { table: { category: "Events" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    ThumbProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Switch {...args} /> };

export const WithDescription: Story = {
  render: () => <Examples.WithDescription />,
};
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const Bordered: Story = { render: () => <Examples.Bordered /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
