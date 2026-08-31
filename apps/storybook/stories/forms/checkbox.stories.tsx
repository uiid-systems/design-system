import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/checkbox/checkbox.examples";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Email me about product updates",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicator: { control: "boolean", table: { category: "Toggles" } },
    indeterminate: { control: "boolean", table: { category: "Toggles" } },
    defaultChecked: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onCheckedChange: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Checkbox {...args} /> };

export const WithDescription: Story = {
  render: () => <Examples.WithDescription />,
};
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Bordered: Story = { render: () => <Examples.Bordered /> };
export const HideIndicator: Story = {
  render: () => <Examples.HideIndicator />,
};
export const Indeterminate: Story = {
  render: () => <Examples.Indeterminate />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
