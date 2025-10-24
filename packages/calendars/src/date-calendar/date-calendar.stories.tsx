import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { DateCalendar } from "./date-calendar";

const meta = {
  title: "Calendars/Date Calendar",
  component: DateCalendar,
} satisfies Meta<typeof DateCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Calendar",
  render: (args) => {
    return (
      <Stack gap={4}>
        <DateCalendar {...args} />
        <DateCalendar
          {...args}
          numberOfMonths={2}
          pagedNavigation
          filters={["firstDayOfMonth"]}
        />
      </Stack>
    );
  },
};
