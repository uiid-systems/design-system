import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { InputDatetime } from "./input-datetime";

const meta = {
  title: "Forms/Inputs/Datetime",
  component: InputDatetime,
  args: {
    disabled: false,
    required: false,
    type: "date",
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <InputDatetime
        {...args}
        label="Date input"
        type="date"
        name="input-date"
        required
      />

      <InputDatetime
        {...args}
        label="Date/time input"
        type="datetime-local"
        name="input-with-label"
        required
      />

      <InputDatetime
        {...args}
        label="Time input"
        type="time"
        name="input-time"
        required
      />

      <InputDatetime
        {...args}
        label="Disabled input"
        type="date"
        name="input-disabled"
        disabled
      />
    </Stack>
  ),
} satisfies Meta<typeof InputDatetime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Datetime" };
