import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/checkbox-group/checkbox-group.examples";
import { MOCK_CHECKBOXGROUP_OPTIONS } from "../../../../packages/forms/src/checkbox-group/checkbox-group.mocks";

const meta = {
  title: "Forms/Checkbox Group",
  component: CheckboxGroup,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Notification channels",
    items: MOCK_CHECKBOXGROUP_OPTIONS,
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
    value: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicators: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },

    CheckboxProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <CheckboxGroup {...args} />,
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
