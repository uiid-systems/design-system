"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
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
    description="The header stays in view while the body and footer collapse."
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
