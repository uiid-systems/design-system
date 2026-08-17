// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Button } from "@uiid/buttons";
import { BellIcon } from "@uiid/icons/bell";
import { GlobeIcon } from "@uiid/icons/globe";
import { SettingsIcon } from "@uiid/icons/settings";
import { Group } from "@uiid/layout";

import { Popover } from "./popover";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Default = () => (
  <Popover
    trigger={<Button>Open popover</Button>}
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
        trigger={<Button>{side}</Button>}
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
    <Popover trigger={<Button>Title only</Button>} title="Title only">
      {BODY}
    </Popover>
    <Popover
      trigger={<Button>Icon and title</Button>}
      icon={GlobeIcon}
      title="Icon and title"
    >
      {BODY}
    </Popover>
    <Popover
      trigger={<Button>Full header</Button>}
      icon={BellIcon}
      title="Full header"
      description="Icon, title, description, and action."
      action={<Button size="xsmall">Action</Button>}
    >
      {BODY}
    </Popover>
  </Group>
);

export const Footer = () => (
  <Popover
    trigger={<Button>Filters</Button>}
    icon={SettingsIcon}
    title="Filters"
    description="Narrow the results."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <Button size="small" variant="subtle">
          Reset
        </Button>
        <Button size="small">Apply</Button>
      </Group>
    }
  >
    {BODY}
  </Popover>
);
