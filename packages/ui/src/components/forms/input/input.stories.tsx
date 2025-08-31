import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "../../layout";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
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
      <Input {...args} placeholder="Regular ol' input" name="regular-input" />

      <Input
        {...args}
        label="Input with a label"
        description="This is a basic description"
        name="input-with-label"
      />

      <Input
        {...args}
        label="Input with a required asterisk"
        description="Type at least 5 characters"
        minLength={5}
        required
        validate
      />

      <Stack ax="stretch" gap={2}>
        <Input
          {...args}
          label="Input with a bookend"
          before={<button style={{ height: "100%" }}>before</button>}
        />
        <Input
          {...args}
          after={<button style={{ height: "100%" }}>after</button>}
        />
      </Stack>

      <Group fullwidth evenly ay="end" gap={2}>
        <Input {...args} label="Input in a group" />
        <Input {...args} />
      </Group>

      <Input {...args} type="date" label="Date input" />
      <Input {...args} type="datetime-local" label="Datetime input" />
      <Input {...args} type="time" label="Time input" />
    </Stack>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input" };
