import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { DateRangePicker } from "./date-range-picker";

const meta = {
  title: "Calendars/Date Range Picker",
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Range Picker",
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  argTypes: {
    selected: { control: "object", table: { category: "Data" } },
    onSelect: { table: { category: "Events" } },
  },
  render: (args) => {
    return (
      <Stack gap={4}>
        <DateRangePicker {...args} />
        <DateRangePicker {...args} numberOfMonths={2} pagedNavigation />
      </Stack>
    );
  },
};
