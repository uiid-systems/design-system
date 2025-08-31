import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { InputCurrency } from "./input-currency";

const meta = {
  title: "Forms/InputCurrency",
  component: InputCurrency,
  args: {
    disabled: false,
    required: false,
    placeholder: "Placeholder",
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <InputCurrency
        {...args}
        placeholder="Regular ol' input"
        name="regular-input"
      />

      <InputCurrency
        {...args}
        label="Input with a label"
        description="This is a basic description"
        name="input-with-label"
      />
    </Stack>
  ),
} satisfies Meta<typeof InputCurrency>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "InputCurrency" };
