// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Button } from "@uiid/buttons";
import { SettingsIcon } from "@uiid/icons/settings";
import { Group, Stack } from "@uiid/layout";

import { Tooltip } from "./tooltip";

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Default = () => (
  <Tooltip trigger={<Button>Hover me</Button>}>Helpful information</Tooltip>
);

/** Positioning is forwarded to the Base UI positioner via `PositionerProps`. */
export const Positioning = () => (
  <Group gap={2}>
    {SIDES.map((side) => (
      <Tooltip
        key={side}
        trigger={<Button>{side}</Button>}
        PositionerProps={{ side, sideOffset: 8, collisionPadding: 16 }}
      >
        Positioned {side}
      </Tooltip>
    ))}
  </Group>
);

/** `delay` is the hover dwell time in milliseconds before the tooltip appears. */
export const Delay = () => (
  <Group gap={2}>
    <Tooltip trigger={<Button>Instant</Button>} delay={0}>
      Shows immediately
    </Tooltip>
    <Tooltip trigger={<Button>Default</Button>}>Uses the default delay</Tooltip>
    <Tooltip trigger={<Button>Slow</Button>} delay={800}>
      Waits 800ms
    </Tooltip>
  </Group>
);

/** Tooltips open on focus as well as hover, so keyboard users reach them too. */
export const Triggers = () => (
  <Stack gap={2} ax="start">
    <Tooltip trigger={<Button>Element trigger</Button>}>
      Attached to the button
    </Tooltip>
    <Tooltip
      trigger={
        <Button shape="square" aria-label="Settings">
          <SettingsIcon />
        </Button>
      }
    >
      Icon buttons need an accessible name of their own
    </Tooltip>
  </Stack>
);
