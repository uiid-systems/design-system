import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../components/layout";

import { Checkbox } from "../components/forms";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <Checkbox {...args} />

      <Checkbox
        {...args}
        label="Checkbox with label"
        name="with-label"
        size="sm"
      />

      <Checkbox
        {...args}
        label="Checkbox with label and description"
        name="with-label-and-description"
        size="sm"
        description="This is a basic description"
      />
    </Stack>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Checkbox" };
