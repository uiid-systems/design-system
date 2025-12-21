import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Input } from "../input/input";

import { Field } from "./field";
import type { FieldProps } from "./field.types";

const meta = {
  title: "Forms/Field",
  component: Field,
  args: {
    label: "Name",
    description: "Visible on your profile",
    error: "Please enter your name",
  },
  render: (args) => (
    <Stack ax="stretch" gap={4}>
      <Field {...args}>
        <Input required />
      </Field>
    </Stack>
  ),
} satisfies Meta<FieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Field" };
