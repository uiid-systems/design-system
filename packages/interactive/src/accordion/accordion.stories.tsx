import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Accordion } from "./accordion";
import { MOCK_ITEMS } from "./accordion.mocks";

const meta: Meta<typeof Accordion> = {
  title: "Interactive/Accordion",
  component: Accordion,
  tags: ["beta"],
  args: {
    items: MOCK_ITEMS,
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { category: "Options" },
    },
  },
  render: (args) => (
    <Stack gap={4} fullwidth maxw={640} ax="stretch">
      <Accordion {...args} />
      <Accordion {...args} defaultValue={["item-1"]} multiple />
      <Accordion {...args} disabled />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Accordion" };
