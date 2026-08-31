import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/radio-group/radio-group.examples";
import { MOCK_RADIOGROUP_OPTIONS } from "../../../../packages/forms/src/radio-group/radio-group.mocks";

const meta = {
  title: "Forms/Radio Group",
  component: RadioGroup,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Shipping speed",
    items: MOCK_RADIOGROUP_OPTIONS,
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { category: "Variants" },
    },

    items: { control: "object", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicators: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },

    RadioProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <RadioGroup {...args} />,
};

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Horizontal: Story = { render: () => <Examples.Horizontal /> };
export const Bordered: Story = { render: () => <Examples.Bordered /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const HideIndicators: Story = {
  render: () => <Examples.HideIndicators />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
export const Composed: Story = { render: () => <Examples.Composed /> };
