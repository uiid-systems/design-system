import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, Hammer, Bug, File, Ghost, Smartphone } from "@uiid/icons";

import { Group, Stack } from "../";
import { List } from "./list";

const MOCK_ITEMS = [
  { value: "1", label: "Item 1", description: "Description 1" },
  { value: "2", label: "Item 2", description: "Description 2" },
  { value: "3", label: "Item 3", description: "Description 3" },
];

const MOCK_LINKS = [
  {
    category: "Features",
    collapsible: true,
    items: [
      { value: "feature", label: "feature", icon: Star },
      { value: "fix", label: "fix", icon: Hammer },
      { value: "bug", label: "bug", icon: Bug },
      { value: "docs", label: "docs", icon: File },
      { value: "internal", label: "internal", icon: Ghost },
      { value: "mobile", label: "mobile", icon: Smartphone },
    ],
  },
  {
    category: "Selected items",
    collapsible: true,
    items: [
      { value: "accordion", label: "accordion", selected: true },
      { value: "alert dialog", label: "alert dialog", selected: true },
      { value: "autocomplete", label: "autocomplete", selected: true },
      { value: "avatar", label: "avatar", selected: true },
      { value: "checkbox", label: "checkbox", selected: true },
      { value: "checkbox group", label: "checkbox group", selected: true },
      { value: "collapsible", label: "collapsible", selected: true },
    ],
  },
  {
    category: "Disabled items",
    items: [
      { value: "combobox", label: "combobox", disabled: true },
      { value: "context menu", label: "context menu", disabled: true },
      { value: "dialog", label: "dialog", disabled: true },
      { value: "field", label: "field", disabled: true },
      { value: "fieldset", label: "fieldset", disabled: true },
      { value: "filterable menu", label: "filterable menu", disabled: true },
    ],
  },
];

const meta = {
  title: "Layout/List",
  component: List,
  args: {
    items: MOCK_ITEMS,
  },
  render: (args) => (
    <Stack gap={16} ax="stretch">
      <Group gap={2}>
        <List {...args} type="ordered" />
        <List {...args} type="unordered" />
        <List {...args} />
      </Group>

      <Stack gap={2} ax="end">
        <List items={args.items} direction="row" type="ordered" />
        <List items={args.items} direction="row" type="unordered" />
        <List items={args.items} direction="row" />
      </Stack>

      <Stack ax="stretch">
        <List items={MOCK_LINKS} fullwidth />
      </Stack>
    </Stack>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "List" };
