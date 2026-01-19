import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Group } from "@uiid/layout";
import { Field, Autocomplete, type AutocompleteProps } from "@uiid/forms";

const MOCK_AUTOCOMPLETE_ITEMS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon",
];

const meta: Meta<AutocompleteProps> = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    items: MOCK_AUTOCOMPLETE_ITEMS,
  },
  argTypes: {
    /** Text */
    placeholder: { control: "text", table: { category: "Text" } },
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    /** Data */
    items: { table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    /** Toggles */
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    /** Events */
    onFocus: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
    onItemHighlighted: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },
    onOpenChangeComplete: { table: { category: "Events" } },
    onValueChange: { table: { category: "Events" } },
    /** Subcomponents */
    RootProps: { table: { category: "Subcomponents" } },
    InputProps: { table: { category: "Subcomponents" } },
    PortalProps: { table: { category: "Subcomponents" } },
    PositionerProps: { table: { category: "Subcomponents" } },
    PopupProps: { table: { category: "Subcomponents" } },
    ListProps: { table: { category: "Subcomponents" } },
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
