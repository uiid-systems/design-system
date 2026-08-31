import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/select/select.examples";
import { MOCK_SELECT_ITEMS } from "../../../../packages/forms/src/select/select.mocks";

const meta = {
  title: "Forms/Select",
  component: Select,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Typeface",
    placeholder: "Select a typeface",
    items: MOCK_SELECT_ITEMS,
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

    items: { control: "object", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },

    multiple: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
    TriggerProps: { control: "object", table: { category: "Subcomponents" } },
    PortalProps: { control: "object", table: { category: "Subcomponents" } },
    PositionerProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
    PopupProps: { control: "object", table: { category: "Subcomponents" } },
    ListProps: { control: "object", table: { category: "Subcomponents" } },
    ValueProps: { control: "object", table: { category: "Subcomponents" } },
    IconProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Select {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Placeholder: Story = { render: () => <Examples.Placeholder /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const ItemContent: Story = { render: () => <Examples.ItemContent /> };
export const Multiple: Story = { render: () => <Examples.Multiple /> };
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const TruncatedValue: Story = {
  render: () => <Examples.TruncatedValue />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const Composed: Story = { render: () => <Examples.Composed /> };
export const Grouped: Story = { render: () => <Examples.Grouped /> };
