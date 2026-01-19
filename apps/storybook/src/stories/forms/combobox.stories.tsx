import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Stack, Group } from "@uiid/layout";
import { Field, Combobox, type ComboboxProps } from "@uiid/forms";

const MOCK_COMBOBOX_ITEMS: ComboboxProps["items"] = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "grape",
  "honeydew",
  "lemon",
  "mango",
  "nectarine",
  "raspberry",
  "strawberry",
  "watermelon",
];

const meta: Meta<ComboboxProps> = {
  title: "Forms/Combobox",
  component: Combobox,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  tags: ["beta"],
  args: {
    placeholder: "Placeholder",
    items: MOCK_COMBOBOX_ITEMS,
    onFocus: fn(),
    onBlur: fn(),
  },
  argTypes: {
    /** Text */
    placeholder: { control: "text", table: { category: "Text" } },
    /** Data */
    items: { table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },
    /** Toggles */
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    /** Events */
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
      <Combobox {...args} />
      <Combobox
        {...args}
        label="Combobox with label and description"
        description="TODO: Fix icon positioning"
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
