import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Card } from "@uiid/cards";
import { GripVertical } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@uiid/interactive";

const VERTICAL_ITEMS = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
  { id: "3", title: "Third item" },
  { id: "4", title: "Fourth item" },
];

const HORIZONTAL_ITEMS = [
  { id: "a", title: "Card A" },
  { id: "b", title: "Card B" },
  { id: "c", title: "Card C" },
];

const GRID_ITEMS = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
  { id: "4", title: "Item 4" },
  { id: "5", title: "Item 5" },
  { id: "6", title: "Item 6" },
];

const meta = {
  title: "Interactive/Sortable",
  tags: ["new"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

function VerticalDemo() {
  const [items, setItems] = useState(VERTICAL_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
      orientation="vertical"
    >
      <SortableContent>
        <Stack gap={2} ax="stretch">
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <Card
                title={item.title}
                fullwidth
                IconProps={{
                  icon: GripVertical,
                  render: <SortableItemHandle />,
                }}
              />
            </SortableItem>
          ))}
        </Stack>
      </SortableContent>
      <SortableOverlay>
        {({ value }) => {
          const item = items.find((i) => i.id === value);
          return item ? (
            <Card title={item.title} icon={GripVertical} fullwidth />
          ) : null;
        }}
      </SortableOverlay>
    </Sortable>
  );
}

function HorizontalDemo() {
  const [items, setItems] = useState(HORIZONTAL_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
      orientation="horizontal"
    >
      <SortableContent>
        <Group gap={2}>
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id} asHandle>
              <Card
                title={item.title}
                icon={GripVertical}
                IconProps={{
                  icon: GripVertical,
                  render: <SortableItemHandle />,
                }}
              />
            </SortableItem>
          ))}
        </Group>
      </SortableContent>
      <SortableOverlay>
        {({ value }) => {
          const item = items.find((i) => i.id === value);
          return item ? <Card title={item.title} icon={GripVertical} /> : null;
        }}
      </SortableOverlay>
    </Sortable>
  );
}

function MixedDemo() {
  const [items, setItems] = useState(GRID_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
      orientation="mixed"
    >
      <SortableContent>
        <Group gap={2} style={{ flexWrap: "wrap", maxWidth: 400 }}>
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id} asHandle>
              <Card
                title={item.title}
                icon={GripVertical}
                IconProps={{
                  icon: GripVertical,
                  render: <SortableItemHandle />,
                }}
              />
            </SortableItem>
          ))}
        </Group>
      </SortableContent>
      <SortableOverlay>
        {({ value }) => {
          const item = items.find((i) => i.id === value);
          return item ? <Card title={item.title} icon={GripVertical} /> : null;
        }}
      </SortableOverlay>
    </Sortable>
  );
}

export const Default: Story = {
  name: "Sortable",
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text size={1} weight="bold">
          Vertical
        </Text>
        <Text size={0} shade="accent" mb={4}>
          Drag items up and down
        </Text>
        <VerticalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Horizontal
        </Text>
        <Text size={0} shade="accent" mb={4}>
          Drag items left and right
        </Text>
        <HorizontalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1}>Mixed</Text>
        <Text size={0} shade="accent" mb={4}>
          Drag items in any direction
        </Text>
        <MixedDemo />
      </Stack>
    </Stack>
  ),
};
