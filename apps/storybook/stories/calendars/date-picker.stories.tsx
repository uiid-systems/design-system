import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, DatePicker } from "@uiid/design-system";

const meta = {
  title: "Calendars/Date Picker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Picker",
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
        <DatePicker {...args} />
        <DatePicker {...args} numberOfMonths={2} pagedNavigation />
      </Stack>
    );
  },
};
