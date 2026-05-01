import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Group, Stack, List, type ListItemOrGroup } from "@uiid/design-system";
import { MOCK_ITEMS, MOCK_LINKS, MOCK_NESTED } from "./list.mocks";

const meta = {
  title: "Lists/List",
  component: List,
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

export const NestedGroups: Story = {
  name: "Nested Groups",
  args: { items: MOCK_NESTED },
  render: (args) => <List {...args} line />,
};

export const ControlledOpen: Story = {
  name: "Controlled Open",
  render: () => {
    const items: ListItemOrGroup[] = MOCK_LINKS ?? [];
    const groupKeys = useMemo(
      () =>
        items
          .filter((item): item is Extract<ListItemOrGroup, { items: unknown }> =>
            "items" in item,
          )
          .map((group) => group.id ?? group.category ?? ""),
      [items],
    );

    const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
      Object.fromEntries(groupKeys.map((key) => [key, true])),
    );

    const allOpen = groupKeys.every((key) => openMap[key]);

    const toggleAll = () =>
      setOpenMap(Object.fromEntries(groupKeys.map((key) => [key, !allOpen])));

    const decorated = items.map((item) => {
      if (!("items" in item)) return item;
      const key = item.id ?? item.category ?? "";
      return {
        ...item,
        open: openMap[key],
        onOpenChange: (open: boolean) =>
          setOpenMap((map) => ({ ...map, [key]: open })),
      };
    });

    return (
      <Stack gap={4}>
        <Group ax="end">
          <Button size="small" onClick={toggleAll}>
            {allOpen ? "Collapse all" : "Expand all"}
          </Button>
        </Group>
        <List items={decorated} line size="small" />
      </Stack>
    );
  },
};

export const Sizes: Story = {
  name: "Sizes",
  args: { items: MOCK_LINKS },
  render: (args) => (
    <Group gap={8} ay="start">
      <Stack gap={2}>
        <List {...args} size="small" />
      </Stack>
      <Stack gap={2}>
        <List {...args} size="medium" />
      </Stack>
      <Stack gap={2}>
        <List {...args} size="large" />
      </Stack>
    </Group>
  ),
};
