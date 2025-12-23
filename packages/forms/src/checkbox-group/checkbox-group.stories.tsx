import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { CheckboxGroup } from "./checkbox-group";
import type { CheckboxGroupProps } from "./checkbox-group.types";
import { MOCK_CHECKBOXGROUP_OPTIONS } from "./checkbox-group.mocks";

const meta = {
  title: "Forms/Checkbox Group",
  component: CheckboxGroup,
  args: {
    items: MOCK_CHECKBOXGROUP_OPTIONS,
  },
  render: (args) => (
    <Stack gap={8}>
      <CheckboxGroup {...args} />
      <CheckboxGroup {...args} bordered />
      <CheckboxGroup {...args} bordered direction="horizontal" />
    </Stack>
  ),
} satisfies Meta<CheckboxGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Checkbox Group" };
