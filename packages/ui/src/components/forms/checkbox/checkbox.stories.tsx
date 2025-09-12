import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Components/Forms/Checkbox",
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
    <Stack gap={4}>
      <Checkbox {...args} name="checkbox" />

      <Checkbox {...args} label="Checkbox with label" name="with-label" />

      <Checkbox
        {...args}
        label="Checkbox with label and description"
        description="This is a basic description"
        name="with-label-and-description"
      />

      <Checkbox
        {...args}
        label="Checkbox is checked by default"
        name="checked-by-default"
        checked
      />

      <Checkbox
        {...args}
        label="Checkbox with indeterminate state"
        description="Indeterminate state is visual only."
        name="indeterminate"
        indeterminate
      />

      <Checkbox
        {...args}
        label="Checkbox with disabled state"
        name="disabled"
        disabled
      />
    </Stack>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Checkbox" };
