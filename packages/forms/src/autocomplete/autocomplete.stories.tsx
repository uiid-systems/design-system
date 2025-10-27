import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Search } from "@uiid/icons";

import { Autocomplete } from "./autocomplete";

const MOCK_ITEMS = [
  { value: "feature", label: "feature" },
  { value: "fix", label: "fix" },
  { value: "bug", label: "bug" },
  { value: "docs", label: "docs" },
  { value: "internal", label: "internal" },
  { value: "mobile", label: "mobile" },
  { value: "component: accordion", label: "component: accordion" },
  { value: "component: alert dialog", label: "component: alert dialog" },
  { value: "component: autocomplete", label: "component: autocomplete" },
  { value: "component: avatar", label: "component: avatar" },
  { value: "component: checkbox", label: "component: checkbox" },
  { value: "component: checkbox group", label: "component: checkbox group" },
  { value: "component: collapsible", label: "component: collapsible" },
  { value: "component: combobox", label: "component: combobox" },
  { value: "component: context menu", label: "component: context menu" },
  { value: "component: dialog", label: "component: dialog" },
  { value: "component: field", label: "component: field" },
  { value: "component: fieldset", label: "component: fieldset" },
  { value: "component: filterable menu", label: "component: filterable menu" },
  { value: "component: form", label: "component: form" },
  { value: "component: input", label: "component: input" },
  { value: "component: menu", label: "component: menu" },
  { value: "component: menubar", label: "component: menubar" },
  { value: "component: meter", label: "component: meter" },
  { value: "component: navigation menu", label: "component: navigation menu" },
  { value: "component: number field", label: "component: number field" },
  { value: "component: popover", label: "component: popover" },
  { value: "c-preview-card", label: "component: preview card" },
  { value: "c-progress", label: "component: progress" },
  { value: "c-radio", label: "component: radio" },
  { value: "c-scroll-area", label: "component: scroll area" },
  { value: "c-select", label: "component: select" },
  { value: "c-separator", label: "component: separator" },
  { value: "c-slider", label: "component: slider" },
  { value: "c-switch", label: "component: switch" },
  { value: "c-tabs", label: "component: tabs" },
  { value: "c-toast", label: "component: toast" },
  { value: "c-toggle", label: "component: toggle" },
  { value: "component: toggle group", label: "component: toggle group" },
  { value: "component: toolbar", label: "component: toolbar" },
  { value: "component: tooltip", label: "component: tooltip" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  args: {
    items: MOCK_ITEMS,
    label: "Input with autocomplete",
    description: "Provide an array of items to populate a filterable dropdown",
  },
  argTypes: {
    onFocus: { action: "onFocus" },
    onBlur: { action: "onBlur" },
    onValueChange: { action: "onValueChange" },
  },
  render: (args) => (
    <Stack gap={4}>
      <Autocomplete items={MOCK_ITEMS} />
      <Autocomplete {...args} />
      <Autocomplete
        {...args}
        before={<Search size={12} />}
        label="Autocomplete with clear enabled"
        items={MOCK_ITEMS}
        enableClear
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Autocomplete" };
