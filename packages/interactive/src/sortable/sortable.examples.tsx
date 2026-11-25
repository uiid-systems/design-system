"use client";

import { GripVerticalIcon } from "@uiid/icons/grip-vertical";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Sortable } from "./sortable";
import { GRID_ITEMS, HORIZONTAL_ITEMS, VERTICAL_ITEMS } from "./sortable.mocks";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "./subcomponents";

type Item = { id: string; title: string };

const Row = ({ title, grip }: { title: string; grip: React.ReactNode }) => (
  <Group gap={3} ay="center" p={3} b={1} w="full">
    {grip}
    <Text>{title}</Text>
  </Group>
);

const Tile = ({ title }: { title: string }) => (
  <Group ax="center" ay="center" p={4} b={1}>
    <Text weight="bold">{title}</Text>
  </Group>
);

const Handle = ({ title }: { title: string }) => (
  <SortableItemHandle aria-label={`Reorder ${title}`}>
    <GripVerticalIcon />
  </SortableItemHandle>
);

/* Drag the grip, or focus it and use Space and the arrow keys. */
export const Default = () => {
  const [items, setItems] = useState<Item[]>(VERTICAL_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent>
        <Stack gap={2}>
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <Row title={item.title} grip={<Handle title={item.title} />} />
            </SortableItem>
          ))}
        </Stack>
      </SortableContent>
    </Sortable>
  );
};

/* `asHandle` makes the whole item draggable, with no separate grip. */
export const Horizontal = () => {
  const [items, setItems] = useState<Item[]>(HORIZONTAL_ITEMS);

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
              <Tile title={item.title} />
            </SortableItem>
          ))}
        </Group>
      </SortableContent>
    </Sortable>
  );
};

/* `mixed` lets items move on both axes, for a wrapping grid. */
export const Grid = () => {
  const [items, setItems] = useState<Item[]>(GRID_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
      orientation="mixed"
    >
      <SortableContent>
        <Group gap={2} wrap maxw={320}>
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id} asHandle>
              <Tile title={item.title} />
            </SortableItem>
          ))}
        </Group>
      </SortableContent>
    </Sortable>
  );
};

/* A disabled item cannot be picked up, and its grip is disabled with it. */
export const Disabled = () => {
  const [items, setItems] = useState<Item[]>(VERTICAL_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent>
        <Stack gap={2}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              value={item.id}
              disabled={item.id === "1"}
            >
              <Row title={item.title} grip={<Handle title={item.title} />} />
            </SortableItem>
          ))}
        </Stack>
      </SortableContent>
    </Sortable>
  );
};

/*
 * The overlay follows the pointer in a portal while the item holds its place.
 * A function child receives the dragged item's value.
 */
export const Overlay = () => {
  const [items, setItems] = useState<Item[]>(VERTICAL_ITEMS);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent>
        <Stack gap={2}>
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <Row title={item.title} grip={<Handle title={item.title} />} />
            </SortableItem>
          ))}
        </Stack>
      </SortableContent>
      <SortableOverlay>
        {({ value }) => {
          const item = items.find((entry) => entry.id === value);
          return item ? (
            <Row title={item.title} grip={<GripVerticalIcon />} />
          ) : null;
        }}
      </SortableOverlay>
    </Sortable>
  );
};

/* A list of strings needs no `getItemValue`: each string is its own id. */
export const Strings = () => {
  const [items, setItems] = useState(["Apples", "Pears", "Plums"]);

  return (
    <Sortable value={items} onValueChange={setItems}>
      <SortableContent>
        <Stack gap={2}>
          {items.map((item) => (
            <SortableItem key={item} value={item} asHandle>
              <Tile title={item} />
            </SortableItem>
          ))}
        </Stack>
      </SortableContent>
    </Sortable>
  );
};
