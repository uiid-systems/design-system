import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { MOCK_SELECT_ITEMS } from "../select/select.mocks";

import { SelectMultiple } from "./select-multiple";
import type { SelectMultipleProps } from "./select-multiple.types";

const meta = {
  title: "Forms/Select Multiple",
  component: SelectMultiple,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    items: MOCK_SELECT_ITEMS,
  },
  argTypes: {
    onValueChange: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },

    items: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },

    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    defaultOpen: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <SelectMultiple {...args} />

      <SelectMultiple
        {...args}
        label="Multi-select with label"
        description="Select multiple options from the list."
      />

      <SelectMultiple
        {...args}
        label="With default values"
        defaultValue={["sans", "mono"]}
      />
    </Stack>
  ),
} satisfies Meta<SelectMultipleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select Multiple" };
