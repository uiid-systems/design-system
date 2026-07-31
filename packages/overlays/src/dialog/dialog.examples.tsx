// Overlays are client components, so their examples cross that boundary too —
// icon props are function components and cannot be passed from a server module.
"use client";

import { Bell, Globe, Settings } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";

import { Dialog } from "./dialog";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SIZES = ["small", "medium", "large", "xlarge"] as const;

export const Default = () => (
  <Dialog
    trigger={<button>Open dialog</button>}
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
        trigger={<button>{size}</button>}
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
    <Dialog trigger={<button>Title only</button>} title="Title only">
      {BODY}
    </Dialog>
    <Dialog
      trigger={<button>Icon and title</button>}
      icon={Globe}
      title="Icon and title"
    >
      {BODY}
    </Dialog>
    <Dialog
      trigger={<button>Full header</button>}
      icon={Bell}
      title="Full header"
      description="Icon, title, description, and action."
      action={<button>Action</button>}
    >
      {BODY}
    </Dialog>
  </Group>
);

export const Footer = () => (
  <Dialog
    trigger={<button>Notification preferences</button>}
    icon={Settings}
    title="Notification preferences"
    description="Choose how and when you'd like to be notified."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <button>Cancel</button>
        <button>Save</button>
      </Group>
    }
  >
    {BODY}
  </Dialog>
);

/** A string trigger is wrapped in a focusable element; an element trigger is used as-is. */
export const Triggers = () => (
  <Stack gap={2} ax="start">
    <Dialog trigger={<button>Element trigger</button>} title="Element trigger">
      {BODY}
    </Dialog>
    <Dialog trigger="String trigger" title="String trigger">
      {BODY}
    </Dialog>
  </Stack>
);