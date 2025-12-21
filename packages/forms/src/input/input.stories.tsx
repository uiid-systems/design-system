import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {
    onFocus: { action: "onFocus" },
    onValueChange: { action: "onValueChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={4}>
      <Input
        {...args}
        placeholder="Regular ol' input"
        defaultValue="Default value"
      />

      <Group fullwidth evenly gap={4}>
        <Input {...args} placeholder="Placeholder" />
        <Input {...args} />
      </Group>
    </Stack>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Input" };
