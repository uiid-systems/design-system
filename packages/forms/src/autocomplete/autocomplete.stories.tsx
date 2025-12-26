import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Autocomplete } from "./autocomplete";
import type { AutocompleteProps } from "./autocomplete.types";

const meta: Meta<AutocompleteProps> = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  args: {
    placeholder: "Placeholder",
    items: ["apple", "banana", "cherry", "date", "elderberry"],
  },
  argTypes: {
    onValueChange: { action: "onValueChange" },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Autocomplete {...args} />
      <Autocomplete
        {...args}
        label="Autocomplete with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <Field
        label="Group of autocompletes with field wrapper"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      >
        <Group fullwidth evenly gap={2}>
          <Autocomplete {...args} placeholder="First name" />
          <Autocomplete {...args} placeholder="Last name" />
        </Group>
      </Field>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Autocomplete" };
