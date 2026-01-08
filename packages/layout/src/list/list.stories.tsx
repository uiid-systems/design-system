import type { Meta, StoryObj } from "@storybook/react-vite";

import { Group, Stack } from "../";

import { List } from "./list";
import { MOCK_ITEMS, MOCK_LINKS } from "./list.mocks";

const meta = {
  title: "Layout/List",
  component: List,
  /**
   * @todo move to standalone package
   * @todo clean up
   */
  tags: ["danger"],
  args: {
    items: MOCK_ITEMS,
  },
  render: (args) => (
    <Group gap={16}>
      <List items={MOCK_LINKS} />
      <Stack gap={16}>
        <Group gap={2}>
          <List {...args} type="ordered" />
          <List {...args} type="unordered" />
          <List {...args} />
        </Group>

        <Stack gap={2} ax="end">
          <List items={args.items} direction="row" type="ordered" />
          <List items={args.items} direction="row" type="unordered" />
          <List items={args.items} direction="row" />
        </Stack>
      </Stack>
    </Group>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "List" };
