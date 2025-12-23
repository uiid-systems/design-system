import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Select } from "./select";
import type { SelectProps } from "./select.types";
import { MOCK_SELECT_ITEMS } from "./select.mocks";

const meta = {
  title: "Forms/Select",
  component: Select,
  args: {
    items: MOCK_SELECT_ITEMS,
  },
  argTypes: {
    onValueChange: { action: "onValueChange" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Select {...args} placeholder="Placeholder" />

      <Select
        {...args}
        label="Select with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <Field
        label="Group of inputs with field"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      >
        <Group fullwidth evenly gap={2}>
          <Select {...args} />
          <Select {...args} />
        </Group>
      </Field>
    </Stack>
  ),
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select" };
