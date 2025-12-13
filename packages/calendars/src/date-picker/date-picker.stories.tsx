import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { DatePicker } from "./date-picker";

const meta = {
  title: "Calendars/Date Picker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Picker",
  render: (args) => {
    return (
      <Stack gap={4}>
        <DatePicker {...args} />
        <DatePicker
          {...args}
          numberOfMonths={2}
          pagedNavigation
          filters={["firstDayOfMonth"]}
        />
        <DatePicker {...args} headless />
      </Stack>
    );
  },
};
