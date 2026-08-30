import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group, Select } from "@uiid/design-system";
import type { SelectProps } from "@uiid/design-system";
import { EyeIcon } from "@uiid/icons/eye";
import { LockIcon } from "@uiid/icons/lock";
import { MailIcon } from "@uiid/icons/mail";
import { SearchIcon } from "@uiid/icons/search";

import { MOCK_SELECT_ITEMS } from "./select.mocks";

const meta = {
  title: "Forms/Select Multiple",
  component: Select,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    items: MOCK_SELECT_ITEMS,
    multiple: true,
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
      <Select {...args} />

      <Select
        {...args}
        label="Multi-select with label"
        description="Select multiple options from the list."
        placeholder="Select options"
      />

      <Select
        {...args}
        label="With default values"
        defaultValue={["sans", "mono"]}
      />
    </Stack>
  ),
} satisfies Meta<SelectProps<string, true>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Select Multiple" };

export const TruncatedValue: Story = {
  name: "Truncated Value",
  args: { defaultValue: ["sans", "serif", "mono", "cursive"] },
  render: (args) => (
    <Stack ax="stretch" gap={8} maxw={280}>
      <Select {...args} fullwidth />
      <Select
        {...args}
        fullwidth
        before={<SearchIcon />}
        after={<MailIcon />}
      />
    </Stack>
  ),
};

export const BeforeAfterSlots: Story = {
  name: "Before & After Slots",
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Select {...args} before={<SearchIcon />} placeholder="Before slot" />
      <Select {...args} after={<MailIcon />} placeholder="After slot" />
      <Select
        {...args}
        before={<LockIcon />}
        after={<EyeIcon />}
        placeholder="Both slots"
      />

      <Group fullwidth gap={4}>
        <Select
          {...args}
          before={<SearchIcon />}
          placeholder="Small"
          size="small"
        />
        <Select
          {...args}
          before={<SearchIcon />}
          placeholder="Medium"
          size="medium"
        />
        <Select
          {...args}
          before={<SearchIcon />}
          placeholder="Large"
          size="large"
        />
      </Group>

      <Select
        {...args}
        before={<SearchIcon />}
        placeholder="Ghost with slot"
        ghost
      />
      <Select
        {...args}
        before={<SearchIcon />}
        placeholder="Disabled"
        disabled
      />
    </Stack>
  ),
};
