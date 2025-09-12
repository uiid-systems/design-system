import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";

import { SelectState } from "./select-state";

const meta = {
  title: "Components/Forms/Selects/Select State",
  component: SelectState,
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
    <Stack ax="stretch" gap={4}>
      <SelectState {...args} />

      <SelectState
        {...args}
        label="Fullname type"
        name="label"
        type="fullname"
      />

      <SelectState {...args} label="Postal type" name="label" type="postal" />
    </Stack>
  ),
} satisfies Meta<typeof SelectState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select State" };
