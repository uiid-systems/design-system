import type { Meta } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { InputColor } from "./input-color";

const meta = {
  title: "Forms/Inputs/Input Color",
  component: InputColor,
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
      <InputColor {...args} name="regular-input" />

      <InputColor
        {...args}
        label="Input with a label and description"
        description="This is a basic description"
        name="input-with-label-and-description"
      />

      <InputColor
        {...args}
        label="Disabled input"
        name="input-disabled"
        disabled
      />
    </Stack>
  ),
} satisfies Meta<typeof InputColor>;

export default meta;

export const Default = { name: "Input Color" };
