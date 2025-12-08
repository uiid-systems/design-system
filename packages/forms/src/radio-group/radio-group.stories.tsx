import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { RadioGroup } from "./radio-group";
import type { RadioGroupProps } from "./radio-group.types";

const MOCK_OPTIONS: RadioGroupProps["options"] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3", disabled: true },
];

const meta = {
  title: "Forms/Radio Group",
  component: RadioGroup,
  args: {
    required: true,
    options: MOCK_OPTIONS,
    name: "radio-group",
  },
  render: (args) => (
    <Stack gap={8}>
      <RadioGroup {...args} />
      <RadioGroup {...args} bordered />
      <RadioGroup {...args} bordered axis="x" />
      <RadioGroup {...args} bordered axis="x" hideIndicator />
    </Stack>
  ),
} satisfies Meta<RadioGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Radio Group" };
