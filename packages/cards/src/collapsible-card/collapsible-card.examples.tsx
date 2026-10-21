"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { useState } from "react";

import { CollapsibleCard } from "./collapsible-card";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const Default = () => (
  <CollapsibleCard maxw={420} title="Collapsible card">
    {BODY}
  </CollapsibleCard>
);

export const DefaultOpen = () => (
  <CollapsibleCard maxw={420} title="Starts open" defaultOpen>
    {BODY}
  </CollapsibleCard>
);

export const FullHeader = () => (
  <CollapsibleCard
    maxw={420}
    defaultOpen
    title="Notification preferences"
    description="The header and footer stay in view while the body collapses."
    action={<Button size="xsmall">Action</Button>}
    footer={
      <Group gap={2} ax="end" fullwidth>
        <Button size="small" variant="subtle">
          Cancel
        </Button>
        <Button size="small">Save</Button>
      </Group>
    }
  >
    {BODY}
  </CollapsibleCard>
);

/**
 * With `clickableHeader`, the title, description and empty space all toggle
 * the card; buttons in the header keep their own click.
 */
export const ClickableHeader = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <Stack gap={3} maxw={420}>
      <CollapsibleCard
        fullwidth
        clickableHeader
        title="Click anywhere in the header"
        description="The title, this description and the empty space all toggle the card. The button keeps its own click."
        ActionProps={{ ay: "center", gap: 2 }}
        action={
          <Button size="xsmall" onClick={() => setCount1((count) => count + 1)}>
            Count: {count1}
          </Button>
        }
      >
        {BODY}
      </CollapsibleCard>
      <CollapsibleCard
        fullwidth
        clickableHeader
        disabled
        title="Disabled"
        action={
          <Button size="xsmall" onClick={() => setCount2((count) => count + 1)}>
            Count: {count2}
          </Button>
        }
      >
        {BODY}
      </CollapsibleCard>
    </Stack>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap={3} maxw={420} ax="start">
      <Button size="small" variant="subtle" onClick={() => setOpen(!open)}>
        {open ? "Collapse" : "Expand"} from outside
      </Button>
      <CollapsibleCard
        fullwidth
        title="Controlled"
        open={open}
        onOpenChange={setOpen}
      >
        {BODY}
      </CollapsibleCard>
    </Stack>
  );
};

export const Stacked = () => (
  <Stack gap={3} maxw={420}>
    <CollapsibleCard title="Billing" defaultOpen>
      {BODY}
    </CollapsibleCard>
    <CollapsibleCard title="Shipping">{BODY}</CollapsibleCard>
    <CollapsibleCard title="Disabled" disabled>
      {BODY}
    </CollapsibleCard>
  </Stack>
);

/** `keepMounted` hides a closed body instead of unmounting it, so its state survives. */
export const KeepMounted = () => (
  <CollapsibleCard maxw={420} title="Keeps its state" keepMounted defaultOpen>
    <input aria-label="Name" placeholder="Type, collapse, then expand" />
  </CollapsibleCard>
);

/** The chevron takes the card's `color`, so its icon and hover match the surface. */
export const Colors = () => (
  <Group gap={3} wrap>
    {PALETTE_HUES.map((color) => (
      <CollapsibleCard
        key={color}
        color={color}
        maxw={260}
        title={color.charAt(0).toUpperCase() + color.slice(1)}
        defaultOpen
      >
        The chevron takes the card's color.
      </CollapsibleCard>
    ))}
  </Group>
);
