// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Button } from "@uiid/buttons";
import { BellIcon } from "@uiid/icons/bell";
import { GlobeIcon } from "@uiid/icons/globe";
import { SettingsIcon } from "@uiid/icons/settings";
import { Group, Stack } from "@uiid/layout";

import { Dialog } from "./dialog";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SIZES = ["small", "medium", "large", "xlarge"] as const;

export const Default = () => (
  <Dialog
    trigger={<Button>Open dialog</Button>}
    title="Dialog title"
    description="A short supporting description that sits beneath the title."
  >
    {BODY}
  </Dialog>
);

export const Sizes = () => (
  <Group gap={2}>
    {SIZES.map((size) => (
      <Dialog
        key={size}
        size={size}
        trigger={<Button>{size}</Button>}
        title={`Size: ${size}`}
        description="Only the max width changes; the dialog stays centered."
      >
        {BODY}
      </Dialog>
    ))}
  </Group>
);

export const HeaderVariants = () => (
  <Group gap={2}>
    <Dialog trigger={<Button>Title only</Button>} title="Title only">
      {BODY}
    </Dialog>
    <Dialog
      trigger={<Button>Icon and title</Button>}
      icon={GlobeIcon}
      title="Icon and title"
    >
      {BODY}
    </Dialog>
    <Dialog
      trigger={<Button>Full header</Button>}
      icon={BellIcon}
      title="Full header"
      description="Icon, title, description, and action."
      action={<Button size="xsmall">Action</Button>}
    >
      {BODY}
    </Dialog>
  </Group>
);

export const Footer = () => (
  <Dialog
    trigger={<Button>Notification preferences</Button>}
    icon={SettingsIcon}
    title="Notification preferences"
    description="Choose how and when you'd like to be notified."
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
  </Dialog>
);

/** A string trigger is wrapped in a focusable element; an element trigger is used as-is. */
export const Triggers = () => (
  <Stack gap={2} ax="start">
    <Dialog trigger={<Button>Element trigger</Button>} title="Element trigger">
      {BODY}
    </Dialog>
    <Dialog trigger="String trigger" title="String trigger">
      {BODY}
    </Dialog>
  </Stack>
);
