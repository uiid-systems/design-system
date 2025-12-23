import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { NumberField } from "./number-field";
import type { NumberFieldProps } from "./number-field.types";

const meta: Meta<typeof NumberField> = {
  title: "Forms/Number Field",
  component: NumberField,
  args: {},
  argTypes: {
    onFocus: { action: "onFocus" },
    onValueChange: { action: "onValueChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <NumberField {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Number Field" };
