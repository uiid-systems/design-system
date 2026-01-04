import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { CheckboxGroup } from "./checkbox-group";
import type { CheckboxGroupProps } from "./checkbox-group.types";
import { MOCK_CHECKBOXGROUP_OPTIONS } from "./checkbox-group.mocks";

const meta = {
  title: "Forms/Checkbox Group",
  component: CheckboxGroup,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    items: MOCK_CHECKBOXGROUP_OPTIONS,
  },
  argTypes: {
    items: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },
    value: { control: "object", table: { category: "Data" } },

    onValueChange: { table: { category: "Events" } },

    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Options" },
    },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicators: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    CheckboxProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={8}>
      <CheckboxGroup {...args} />
      <CheckboxGroup {...args} direction="horizontal" />
      <CheckboxGroup {...args} bordered />
      <CheckboxGroup {...args} bordered direction="horizontal" />
      <CheckboxGroup
        {...args}
        bordered
        direction="horizontal"
        label="With label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <CheckboxGroup
        {...args}
        bordered
        direction="horizontal"
        label="Without indicators"
        hideIndicators
      />
    </Stack>
  ),
} satisfies Meta<CheckboxGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Checkbox Group" };
