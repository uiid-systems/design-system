import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, TriangleAlert, Ban } from "@uiid/icons";
import { Group, Stack } from "../";

import { List } from "./list";
import { ListItem } from "./subcomponents";

const MOCK_ITEMS = [
  { value: "1", label: "Item 1" },
  { value: "2", label: "Item 2" },
  { value: "3", label: "Item 3" },
];

const MOCK_LINKS = [
  { value: "feature", label: "feature" },
  { value: "fix", label: "fix" },
  { value: "bug", label: "bug" },
  { value: "docs", label: "docs" },
  { value: "internal", label: "internal", selected: true, icon: Info },
  { value: "mobile", label: "mobile", selected: true, icon: TriangleAlert },
  {
    value: "component: accordion",
    label: "component: accordion",
    selected: true,
    icon: Ban,
  },
  { value: "component: alert dialog", label: "component: alert dialog" },
  { value: "component: autocomplete", label: "component: autocomplete" },
  { value: "component: avatar", label: "component: avatar", selected: true },
  { value: "component: checkbox", label: "component: checkbox" },
  { value: "component: checkbox group", label: "component: checkbox group" },
  { value: "component: collapsible", label: "component: collapsible" },
  {
    value: "component: combobox",
    label: "component: combobox",
    disabled: true,
  },
  {
    value: "component: context menu",
    label: "component: context menu",
    disabled: true,
  },
  { value: "component: dialog", label: "component: dialog", disabled: true },
  { value: "component: field", label: "component: field", disabled: true },
  {
    value: "component: fieldset",
    label: "component: fieldset",
    disabled: true,
  },
  {
    value: "component: filterable menu",
    label: "component: filterable menu",
    disabled: true,
  },
];

const meta = {
  title: "Layout/List",
  component: List,
  args: {
    children: MOCK_ITEMS.map((item) => (
      <ListItem key={item.value} {...item}>
        {item.label}
      </ListItem>
    )),
  },
  render: (args) => (
    <Stack gap={2}>
      <Group gap={2}>
        <List {...args} type="ordered" />
        <List {...args} type="unordered" />
        <List {...args} />
        <List direction="row" />
      </Group>

      <Stack ax="stretch">
        <List>
          {MOCK_LINKS.map((item) => (
            <ListItem key={item.value} {...item}>
              {item.label}
            </ListItem>
          ))}
        </List>
      </Stack>
    </Stack>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "List" };
