import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, Hammer, Bug, File, Ghost, Smartphone } from "@uiid/icons";

import { Stack } from "@uiid/layout";

import { ListDropdown } from "./list-dropdown";

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
  title: "Dropdowns/List Dropdown",
  component: ListDropdown,
  args: {
    items: MOCK_LINKS,
    placeholder: "Select an item",
  },
} satisfies Meta<typeof ListDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "List Dropdown",
  render: (args) => {
    return (
      <Stack gap={4}>
        <ListDropdown {...args} />
      </Stack>
    );
  },
};
