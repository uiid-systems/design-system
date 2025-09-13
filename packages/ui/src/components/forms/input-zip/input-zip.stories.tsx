import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { InputZip } from "./input-zip";

const meta = {
  title: "Components/Forms/Inputs/Input Zip",
  component: InputZip,
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
      <InputZip {...args} name="regular-input" />
    </Stack>
  ),
} satisfies Meta<typeof InputZip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input Zip" };
