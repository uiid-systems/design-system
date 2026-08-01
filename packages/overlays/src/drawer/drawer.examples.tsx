// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Bell, Globe, Settings } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Drawer } from "./drawer";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const DIRECTIONS = ["up", "down", "left", "right"] as const;

export const Default = () => (
  <Drawer
    trigger={<button>Open drawer</button>}
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
        trigger={<button>{swipeDirection}</button>}
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
    trigger={<button>Open bottom sheet</button>}
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
    trigger={<button>Open inspector</button>}
    title="Inspector"
    description="The page behind remains interactive."
  >
    {BODY}
  </Drawer>
);

export const HeaderVariants = () => (
  <Group gap={2}>
    <Drawer trigger={<button>Title only</button>} title="Title only">
      {BODY}
    </Drawer>
    <Drawer
      trigger={<button>Icon and title</button>}
      icon={Globe}
      title="Icon and title"
    >
      {BODY}
    </Drawer>
    <Drawer
      trigger={<button>Full header</button>}
      icon={Bell}
      title="Full header"
      description="Icon, title, description, and action."
      action={<button>Action</button>}
    >
      {BODY}
    </Drawer>
  </Group>
);

export const Footer = () => (
  <Drawer
    swipeDirection="right"
    trigger={<button>Edit preferences</button>}
    icon={Settings}
    title="Preferences"
    description="The footer sits below the body, separated by a divider."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <button>Cancel</button>
        <button>Save</button>
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
