import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { DateRangeCalendar } from "./date-range-calendar";

const meta = {
  title: "Calendars/Date Range Calendar",
  component: DateRangeCalendar,
} satisfies Meta<typeof DateRangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Range Calendar",
  render: (args) => {
    return (
      <Stack gap={4}>
        <DateRangeCalendar {...args} />
        <DateRangeCalendar
          {...args}
          numberOfMonths={2}
          pagedNavigation
          filters={["last7Days", "next7Days"]}
        />
      </Stack>
    );
  },
};
