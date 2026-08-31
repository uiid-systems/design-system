import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/number-field/number-field.examples";

const meta = {
  title: "Forms/Number Field",
  component: NumberField,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Quantity",
    description: "Use the arrow keys for fine adjustments.",
    defaultValue: 1,
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

    value: { control: "number", table: { category: "Data" } },
    defaultValue: { control: "number", table: { category: "Data" } },
    format: { control: "object", table: { category: "Data" } },
    locale: { control: "text", table: { category: "Data" } },

    min: { control: "number", table: { category: "Options" } },
    max: { control: "number", table: { category: "Options" } },
    step: { control: "number", table: { category: "Options" } },
    smallStep: { control: "number", table: { category: "Options" } },
    largeStep: { control: "number", table: { category: "Options" } },

    snapOnStep: { control: "boolean", table: { category: "Toggles" } },
    allowWheelScrub: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onValueCommitted: { table: { category: "Events" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    GroupProps: { control: "object", table: { category: "Subcomponents" } },
    DecrementProps: { control: "object", table: { category: "Subcomponents" } },
    IncrementProps: { control: "object", table: { category: "Subcomponents" } },
    InputProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <NumberField {...args} />,
};

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const MinMax: Story = { render: () => <Examples.MinMax /> };
export const Steps: Story = { render: () => <Examples.Steps /> };
export const Format: Story = { render: () => <Examples.Format /> };
export const Placeholder: Story = { render: () => <Examples.Placeholder /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const ErrorTypes: Story = { render: () => <Examples.ErrorTypes /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const WithScrubArea: Story = {
  render: () => <Examples.WithScrubArea />,
};
