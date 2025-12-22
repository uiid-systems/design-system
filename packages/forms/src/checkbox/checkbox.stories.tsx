import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: {},
  argTypes: {
    onCheckedChange: { action: "onCheckedChange" },
  },
  render: (args) => (
    <Stack gap={4}>
      <Checkbox {...args} />
      <Checkbox {...args} label="Checkbox" />
      <Checkbox {...args} label="Default checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate defaultChecked />
      <Checkbox {...args} bordered label="Bordered" />
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
