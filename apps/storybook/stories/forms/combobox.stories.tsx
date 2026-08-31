import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/combobox/combobox.examples";
import { MOCK_COMBOBOX_ITEMS } from "../../../../packages/forms/src/combobox/combobox.mocks";

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Fruit",
    placeholder: "Search fruit",
    items: MOCK_COMBOBOX_ITEMS,
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },

    items: { control: "object", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },

    multiple: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },
    onFocus: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    InputProps: { control: "object", table: { category: "Subcomponents" } },
    InputGroupProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
    PortalProps: { control: "object", table: { category: "Subcomponents" } },
    PositionerProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
    PopupProps: { control: "object", table: { category: "Subcomponents" } },
    ListProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Combobox {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const Multiple: Story = { render: () => <Examples.Multiple /> };
export const Grouped: Story = { render: () => <Examples.Grouped /> };
