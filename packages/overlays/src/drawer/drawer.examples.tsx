// Overlays are client components, so their examples cross that boundary too.
"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useRef, useState } from "react";

import { Drawer } from "./drawer";

const ITEMS = ["Opening", "Middlegame", "Bear-off"];

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const DIRECTIONS = ["up", "down", "left", "right"] as const;

export const Default = () => (
  <Drawer
    trigger={<Button>Open drawer</Button>}
    title="Drawer title"
    description="Drag the panel toward its edge to dismiss it."
  >
    {BODY}
  </Drawer>
);

/**
 * `swipeDirection` is both the edge the drawer is anchored to and the direction
 * a swipe dismisses it. It defaults to `down` — a bottom sheet.
 */
export const SwipeDirections = () => (
  <Group gap={2}>
    {DIRECTIONS.map((swipeDirection) => (
      <Drawer
        key={swipeDirection}
        swipeDirection={swipeDirection}
        trigger={<Button>{swipeDirection}</Button>}
        title={`Anchored ${swipeDirection}`}
        description="Swipe toward the anchored edge to dismiss."
      >
        {BODY}
      </Drawer>
    ))}
  </Group>
);

/**
 * Snap points let the panel rest partway open. Values from 0–1 are fractions of
 * the viewport, numbers above 1 are pixels, and strings are CSS lengths.
 */
export const SnapPoints = () => (
  <Drawer
    swipeDirection="down"
    snapPoints={[0.3, 0.6, 1]}
    trigger={<Button>Open bottom sheet</Button>}
    title="Snap points"
    description="Drag between a third, two thirds, and full height."
  >
    {BODY}
  </Drawer>
);

/** With `modal={false}` the page behind stays scrollable and clickable. */
export const NonModal = () => (
  <Drawer
    modal={false}
    swipeDirection="right"
    trigger={<Button>Open inspector</Button>}
    title="Inspector"
    description="The page behind remains interactive."
  >
    {BODY}
  </Drawer>
);

export const HeaderVariants = () => (
  <Group gap={2}>
    <Drawer trigger={<Button>Title only</Button>} title="Title only">
      {BODY}
    </Drawer>
    <Drawer
      trigger={<Button>Full header</Button>}
      title="Full header"
      description="Title, description, and action."
      action={<Button size="xsmall">Action</Button>}
    >
      {BODY}
    </Drawer>
  </Group>
);

export const Footer = () => (
  <Drawer
    swipeDirection="right"
    trigger={<Button>Edit preferences</Button>}
    title="Preferences"
    description="The footer sits below the body, separated by a divider."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <Button size="small" variant="subtle">
          Cancel
        </Button>
        <Button size="small">Save</Button>
      </Group>
    }
  >
    <Stack gap={2}>
      <Text>{BODY}</Text>
      <Text size={0} shade="muted">
        Text inside the body stays selectable — dragging it won&apos;t start a
        swipe.
      </Text>
    </Stack>
  </Drawer>
);

/*
 * One drawer for a whole list: each row's button opens it, and `finalFocus`
 * returns focus to the button that did. No `trigger`, so no trigger renders.
 */
export const OpenedFromElsewhere = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(ITEMS[0]);
  const returnTo = useRef<HTMLElement | null>(null);

  return (
    <Stack gap={2} ax="start">
      {ITEMS.map((item) => (
        <Group key={item} gap={2} ay="center">
          <Text>{item}</Text>
          <Button
            size="small"
            variant="subtle"
            onClick={(event) => {
              returnTo.current = event.currentTarget;
              setSelected(item);
              setOpen(true);
            }}
          >
            View
          </Button>
        </Group>
      ))}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        swipeDirection="right"
        PopupProps={{ finalFocus: returnTo }}
        title={selected}
        description="One drawer shared by every row. Close it and focus returns to the button that opened it."
      >
        {BODY}
      </Drawer>
    </Stack>
  );
};
