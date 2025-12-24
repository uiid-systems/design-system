import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Combobox } from "./combobox";
import type { ComboboxProps } from "./combobox.types";
import { MOCK_COMBOBOX_ITEMS } from "./combobox.mocks";

const meta: Meta<ComboboxProps> = {
  title: "Forms/Combobox",
  component: Combobox,
  args: {
    placeholder: "Placeholder",
    items: MOCK_COMBOBOX_ITEMS,
  },
  argTypes: {
    onFocus: { action: "onFocus" },
    onValueChange: { action: "onValueChange" },
    onBlur: { action: "onBlur" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Combobox {...args} />
      <Combobox
        {...args}
        label="Combobox with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <Field
        label="Group of comboboxes with field wrapper"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      >
        <Group fullwidth evenly gap={2}>
          <Combobox {...args} placeholder="First name" />
          <Combobox {...args} placeholder="Last name" />
        </Group>
      </Field>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Combobox" };
