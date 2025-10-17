import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { InputPassword } from "./input-password";

const meta = {
  title: "Forms/Inputs/Input Password",
  component: InputPassword,
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
      <InputPassword
        {...args}
        label="Password input"
        name="input-password"
        required
      />
    </Stack>
  ),
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input Password" };
