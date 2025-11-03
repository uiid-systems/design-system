import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { MonthCarousel } from "./month-carousel";

const meta = {
  title: "Calendars/Month Carousel",
  component: MonthCarousel,
} satisfies Meta<typeof MonthCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Month Carousel",
  render: (args) => {
    return (
      <Stack gap={4}>
        <MonthCarousel {...args} />
      </Stack>
    );
  },
};
