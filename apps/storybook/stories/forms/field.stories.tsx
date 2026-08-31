import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, InputControl } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/field/field.examples";

const meta = {
  title: "Forms/Field",
  component: Field,
  args: {
    label: "Email",
    description: "We'll never share this with anyone.",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    hint: { control: "object", table: { category: "Text" } },

    errorType: {
      control: "select",
      options: ["inline", "tooltip", "absolute"],
      table: { category: "Variants" },
    },
    validationMode: {
      control: "select",
      options: ["onSubmit", "onBlur", "onChange"],
      table: { category: "Options" },
    },
    name: { control: "text", table: { category: "Options" } },
    validate: { table: { category: "Options" } },

    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    invalid: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    LabelProps: { control: "object", table: { category: "Subcomponents" } },
    ErrorProps: { control: "object", table: { category: "Subcomponents" } },
    HintProps: { control: "object", table: { category: "Subcomponents" } },
    DescriptionProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Field {...args}>
      <InputControl placeholder="you@example.com" />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => <Examples.WithDescription />,
};
export const Required: Story = { render: () => <Examples.Required /> };
export const WithHint: Story = { render: () => <Examples.WithHint /> };
export const Validate: Story = { render: () => <Examples.Validate /> };
export const ErrorTypes: Story = { render: () => <Examples.ErrorTypes /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Bare: Story = { render: () => <Examples.Bare /> };
export const Grouped: Story = { render: () => <Examples.Grouped /> };
export const AnyControl: Story = { render: () => <Examples.AnyControl /> };
