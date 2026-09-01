import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autocomplete } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/autocomplete/autocomplete.examples";
import { MOCK_AUTOCOMPLETE_ITEMS } from "../../../../packages/forms/src/autocomplete/autocomplete.mocks";

const meta = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Fruit",
    placeholder: "Search fruit",
    items: MOCK_AUTOCOMPLETE_ITEMS,
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

    items: { control: "object", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },

    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },
    onItemHighlighted: { table: { category: "Events" } },
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
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Autocomplete {...args} />,
};

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const BeforeAfterSlots: Story = {
  render: () => <Examples.BeforeAfterSlots />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const Grouped: Story = { render: () => <Examples.Grouped /> };
