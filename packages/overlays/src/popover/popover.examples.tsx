// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Bell, Globe, Settings } from "@uiid/icons";
import { Group } from "@uiid/layout";

import { Popover } from "./popover";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Default = () => (
  <Popover
    trigger={<button>Open popover</button>}
    title="Popover title"
    description="Anchored to the trigger and repositioned to stay on screen."
  >
    {BODY}
  </Popover>
);

/** Positioning is forwarded to the Base UI positioner via `PositionerProps`. */
export const Positioning = () => (
  <Group gap={2}>
    {SIDES.map((side) => (
      <Popover
        key={side}
        trigger={<button>{side}</button>}
        PositionerProps={{ side, sideOffset: 8, collisionPadding: 16 }}
        title={`Side: ${side}`}
      >
        Flips to the opposite side when there isn&apos;t room.
      </Popover>
    ))}
  </Group>
);

export const HeaderVariants = () => (
  <Group gap={2}>
    <Popover trigger={<button>Title only</button>} title="Title only">
      {BODY}
    </Popover>
    <Popover
      trigger={<button>Icon and title</button>}
      icon={Globe}
      title="Icon and title"
    >
      {BODY}
    </Popover>
    <Popover
      trigger={<button>Full header</button>}
      icon={Bell}
      title="Full header"
      description="Icon, title, description, and action."
      action={<button>Action</button>}
    >
      {BODY}
    </Popover>
  </Group>
);

export const Footer = () => (
  <Popover
    trigger={<button>Filters</button>}
    icon={Settings}
    title="Filters"
    description="Narrow the results."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <button>Reset</button>
        <button>Apply</button>
      </Group>
    }
  >
    {BODY}
  </Popover>
);