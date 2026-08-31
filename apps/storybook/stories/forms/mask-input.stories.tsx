import type { Meta, StoryObj } from "@storybook/react-vite";
import { MaskInput } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/mask-input/mask-input.examples";

const meta = {
  title: "Forms/Mask Input",
  component: MaskInput,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    mask: "phone",
    label: "Phone number",
    description: "Digits only — the separators are added for you.",
    placeholder: "(555) 555-5555",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },
    maskPlaceholder: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },

    mask: {
      control: "select",
      options: [
        "phone",
        "ssn",
        "date",
        "time",
        "creditCard",
        "creditCardExpiry",
        "zipCode",
        "zipCodeExtended",
        "currency",
        "percentage",
        "licensePlate",
        "ipv4",
        "macAddress",
        "isbn",
        "ein",
      ],
      table: { category: "Options" },
    },
    validationMode: {
      control: "select",
      options: ["onChange", "onBlur", "onSubmit", "onTouched", "all"],
      table: { category: "Options" },
    },
    currency: {
      control: "select",
      options: ["USD", "EUR", "GBP", "JPY"],
      table: { category: "Options" },
    },
    locale: {
      control: "select",
      options: ["en-US", "de-DE", "en-GB", "ja-JP"],
      table: { category: "Options" },
    },

    ghost: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    withoutMask: { control: "boolean", table: { category: "Toggles" } },
    invalid: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onValidate: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof MaskInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <MaskInput {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Patterns: Story = { render: () => <Examples.Patterns /> };
export const MaskPlaceholder: Story = {
  render: () => <Examples.MaskPlaceholder />,
};
export const Currency: Story = { render: () => <Examples.Currency /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const WithoutMask: Story = { render: () => <Examples.WithoutMask /> };
export const Validation: Story = { render: () => <Examples.Validation /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
