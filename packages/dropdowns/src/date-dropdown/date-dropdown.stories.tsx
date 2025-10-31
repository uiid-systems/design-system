import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { DateDropdown } from "./date-dropdown";

const meta = {
  title: "Dropdowns/Date Dropdown",
  component: DateDropdown,
  args: {},
} satisfies Meta<typeof DateDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Date Dropdown",
  render: (args) => {
    return (
      <Stack gap={4}>
        <DateDropdown {...args} />
      </Stack>
    );
  },
};
