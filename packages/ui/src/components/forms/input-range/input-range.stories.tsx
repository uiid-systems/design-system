import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { InputRange } from "./input-range";

const meta = {
  title: "Forms/Inputs/Input Range",
  component: InputRange,
  args: {
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <InputRange {...args} name="regular-input" />

      <InputRange
        {...args}
        label="Required input with a label and description"
        description="This is a basic description"
        name="input-with-label"
        required
      />

      <InputRange
        {...args}
        label="With tick marks"
        description="Range input with auto-generated tick marks"
        name="input-with-ticks"
        min={0}
        max={10}
        step={1}
        tickMarks={true}
      />

      <InputRange
        {...args}
        label="Disabled"
        description=""
        name="input-disabled"
        disabled
      />
    </Stack>
  ),
} satisfies Meta<typeof InputRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input Range" };
