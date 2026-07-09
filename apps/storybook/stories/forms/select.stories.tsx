import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Stack,
  Group,
  Field,
  Select,
} from "@uiid/design-system";
import type { SelectProps } from "@uiid/design-system";
import { SearchIcon, MailIcon, EyeIcon, LockIcon } from "@uiid/icons";
import { MOCK_SELECT_ITEMS } from "./select.mocks";

const meta = {
  title: "Forms/Select",
  component: Select,
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
    onOpenChangeComplete: { table: { category: "Events" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },

    items: { control: "object", table: { category: "Data" } },
    value: { control: "text", table: { category: "Data" } },
    defaultValue: { control: "text", table: { category: "Data" } },

    placeholder: { control: "text", table: { category: "Text" } },
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    defaultOpen: { control: "boolean", table: { category: "Toggles" } },
    open: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
    TriggerProps: { control: "object", table: { category: "Subcomponents" } },
    PortalProps: { control: "object", table: { category: "Subcomponents" } },
    PositionerProps: {
      control: "object",
      table: { category: "Subcomponents" },
    },
    PopupProps: { control: "object", table: { category: "Subcomponents" } },
    ListProps: { control: "object", table: { category: "Subcomponents" } },
    ValueProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Select {...args} placeholder="Placeholder" />

      <Select
        {...args}
        label="Select with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

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

const LONG_SELECT_ITEMS = [
  {
    label:
      "A very long option label that cannot fit inside the trigger and must truncate with an ellipsis",
    value: "long",
  },
  { label: "Short option", value: "short" },
];

export const TruncatedValue: Story = {
  name: "Truncated Value",
  args: { items: LONG_SELECT_ITEMS, defaultValue: "long" },
  render: (args) => (
    <Stack ax="stretch" gap={8} maxw={280}>
      <Select {...args} fullwidth />
      <Select {...args} fullwidth before={<SearchIcon />} after={<MailIcon />} />
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
      <Select
        {...args}
        before={<span>$</span>}
        after={<span>USD</span>}
        placeholder="Text slots"
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
        placeholder="Full width"
        fullwidth
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
