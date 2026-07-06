import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group, SelectMultiple } from "@uiid/design-system";
import type { SelectMultipleProps } from "@uiid/design-system";
import { SearchIcon, MailIcon, EyeIcon, LockIcon } from "@uiid/icons";
import { MOCK_SELECT_ITEMS } from "./select.mocks";

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
        placeholder="Select options"
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

export const BeforeAfterSlots: Story = {
  name: "Before & After Slots",
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <SelectMultiple
        {...args}
        before={<SearchIcon />}
        placeholder="Before slot"
      />
      <SelectMultiple
        {...args}
        after={<MailIcon />}
        placeholder="After slot"
      />
      <SelectMultiple
        {...args}
        before={<LockIcon />}
        after={<EyeIcon />}
        placeholder="Both slots"
      />

      <Group fullwidth gap={4}>
        <SelectMultiple
          {...args}
          before={<SearchIcon />}
          placeholder="Small"
          size="small"
        />
        <SelectMultiple
          {...args}
          before={<SearchIcon />}
          placeholder="Medium"
          size="medium"
        />
        <SelectMultiple
          {...args}
          before={<SearchIcon />}
          placeholder="Large"
          size="large"
        />
      </Group>

      <SelectMultiple
        {...args}
        before={<SearchIcon />}
        placeholder="Ghost with slot"
        ghost
      />
      <SelectMultiple
        {...args}
        before={<SearchIcon />}
        placeholder="Disabled"
        disabled
      />
    </Stack>
  ),
};
