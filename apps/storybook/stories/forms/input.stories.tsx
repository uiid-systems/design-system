import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/input/input.examples";

const meta = {
  title: "Forms/Input",
  component: Input,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Email",
    description: "We'll only ever use this to send you receipts.",
    placeholder: "you@example.com",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },

    ghost: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onFocus: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Input {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const ErrorTypes: Story = { render: () => <Examples.ErrorTypes /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const Grouped: Story = { render: () => <Examples.Grouped /> };
