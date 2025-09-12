import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "../../layout";
import { Button } from "../../buttons";
import { Input } from "../";

import { Select } from "./select";

const MOCK_ITEMS = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

const meta = {
  title: "Components/Forms/Selects/Select",
  component: Select,
  args: {
    disabled: false,
    required: false,
    options: MOCK_ITEMS,
  },
  argTypes: {
    validate: { control: "boolean" },
    onClick: { action: "onClick" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={4}>
      <Select {...args} />

      <Select
        {...args}
        label="Select with label"
        description="This is a basic description"
        name="label"
        required
      />

      <Select
        {...args}
        label="With placeholder and bookends"
        description="Set a disabled placeholder"
        placeholder="Select an option"
        before="B"
      />

      <Group fullwidth evenly gap={2} ay="end">
        <Input
          label="Input, select, button"
          placeholder="Write something"
          size={args.size}
        />
        <Select placeholder="Select something" {...args} />
        <Button size={args.size}>Click</Button>
      </Group>
    </Stack>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select" };
