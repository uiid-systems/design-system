import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { MonthCalendar } from "./month-calendar";

const meta = {
  title: "Calendars/Month Calendar",
  component: MonthCalendar,
} satisfies Meta<typeof MonthCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Month Calendar",
  render: (args) => {
    return (
      <Stack gap={4}>
        <MonthCalendar {...args} />
        <MonthCalendar {...args} numberOfMonths={2} pagedNavigation />
      </Stack>
    );
  },
};
