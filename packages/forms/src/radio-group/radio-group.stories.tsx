import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { RadioGroup } from "./radio-group";
import type { RadioGroupProps } from "./radio-group.types";
import { MOCK_RADIOGROUP_OPTIONS } from "./radio-group.mocks";

const meta: Meta<RadioGroupProps> = {
  title: "Forms/Radio Group",
  component: RadioGroup,
  args: {
    required: true,
    items: MOCK_RADIOGROUP_OPTIONS,
    name: "radio-group",
  },
  render: (args) => (
    <Stack gap={8}>
      <RadioGroup {...args} />
      <RadioGroup {...args} direction="horizontal" />
      <RadioGroup {...args} bordered />
      <RadioGroup {...args} bordered direction="horizontal" />
      <RadioGroup
        {...args}
        bordered
        direction="horizontal"
        label="With label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <RadioGroup
        {...args}
        bordered
        direction="horizontal"
        label="Without indicators"
        hideIndicators
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Radio Group" };
