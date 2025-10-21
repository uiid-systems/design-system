import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Send, Bell, MessageCircleMore, ExternalLink } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

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
        <MonthCalendar {...args} numberOfMonths={2} />
      </Stack>
    );
  },
};
