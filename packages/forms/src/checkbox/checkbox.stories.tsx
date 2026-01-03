import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: {},
  argTypes: {
    /** Text */
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    /** Variants */
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
    /** Data */
    defaultChecked: { control: "boolean", table: { category: "Data" } },
    uncheckedValue: { control: "boolean", table: { category: "Data" } },
    /** Events */
    onCheckedChange: {
      action: "onCheckedChange",
      table: { category: "Events" },
    },
    onFocus: { action: "onFocus", table: { category: "Events" } },
    onBlur: { action: "onBlur", table: { category: "Events" } },
    /** Toggles */
    indeterminate: { control: "boolean", table: { category: "Toggles" } },
    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    nativeButton: { control: "boolean", table: { category: "Toggles" } },
    /** Subcomponents */
    ContainerProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <Checkbox {...args} />
      <Checkbox {...args} label="With label" />
      <Checkbox {...args} label="Default checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" defaultChecked indeterminate />
      <Checkbox {...args} label="Bordered" bordered />
      <Checkbox {...args} label="Reversed" bordered reversed />
      <Checkbox {...args} label="Hidden indicator" bordered hideIndicator />
      <Checkbox
        {...args}
        bordered
        label="Bordered with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Checkbox" };
