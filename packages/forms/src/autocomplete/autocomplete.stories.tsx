import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Autocomplete } from "./autocomplete";
import type { AutocompleteProps } from "./autocomplete.types";
import { MOCK_AUTOCOMPLETE_ITEMS } from "./autocomplete.mocks";

const meta: Meta<AutocompleteProps> = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  tags: ["beta"],
  args: {
    items: MOCK_AUTOCOMPLETE_ITEMS,
  },
  argTypes: {
    /** Text */
    placeholder: { control: "text", table: { category: "Text" } },
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    /** Data */
    items: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    /** Toggles */
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    /** Events */
    onFocus: { action: "onFocus", table: { category: "Events" } },
    onBlur: { action: "onBlur", table: { category: "Events" } },
    onItemHighlighted: {
      action: "onItemHighlighted",
      table: { category: "Events" },
    },
    onOpenChange: { action: "onOpenChange", table: { category: "Events" } },
    onOpenChangeComplete: {
      action: "onOpenChangeComplete",
      table: { category: "Events" },
    },
    onValueChange: { action: "onValueChange", table: { category: "Events" } },
    /** Subcomponents */
    RootProps: { control: "object", table: { category: "Subcomponents" } },
    InputProps: { control: "object", table: { category: "Subcomponents" } },
    PortalProps: { control: "object", table: { category: "Subcomponents" } },
    PositionerProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
    PopupProps: { control: "object", table: { category: "Subcomponents" } },
    ListProps: { control: "object", table: { category: "Subcomponents" } },
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
