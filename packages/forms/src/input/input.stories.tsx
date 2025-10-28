import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";
import { Input } from "./input";

const meta = {
  title: "Forms/Inputs/Input",
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
    <Stack ax="stretch" gap={4}>
      <Input {...args} placeholder="Regular ol' input" name="regular-input" />

      <Input
        {...args}
        label="Input with label, description, hint"
        description="This is a basic description"
        hint="Optional"
        name="input-with-label"
      />

      <Input
        {...args}
        label="Required input"
        description="Type at least 5 characters"
        minLength={5}
        required
        validate
      />

      <Input
        {...args}
        label="Input with an error"
        description="Type at least 5 characters"
        errorMessage="You haven't typed enough characters!"
        hasError
        minLength={5}
        validate
      />

      <Input {...args} label="Input with bookends" before="B" after="A" />

      <Input {...args} label="Input with clear" enableClear />

      <Group fullwidth evenly ay="end" gap={2}>
        <Input {...args} label="Input in a group" />
        <Input {...args} />
      </Group>
    </Stack>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input" };
