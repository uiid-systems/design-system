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
  render: (args) => {
    return (
      <Stack gap={4}>
        <DateRangePicker {...args} />
        <DateRangePicker
          {...args}
          numberOfMonths={2}
          pagedNavigation
          filters={["last7Days", "next7Days"]}
        />
      </Stack>
    );
  },
};
