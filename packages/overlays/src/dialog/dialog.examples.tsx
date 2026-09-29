// Overlays are client components, so their examples cross that boundary too.
"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

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
      trigger={<Button>Full header</Button>}
      title="Full header"
      description="Title, description, and action."
      action={<Button size="xsmall">Action</Button>}
    >
      {BODY}
    </Dialog>
  </Group>
);

export const Footer = () => (
  <Dialog
    trigger={<Button>Notification preferences</Button>}
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

/**
 * A string becomes a focusable `role="button"` span, and a `Button` keeps its
 * native semantics. A function receives the trigger's state and is wrapped the
 * same way as a string. A component element that renders anything other than
 * a `<button>` can't be inspected before it renders, so a static `Text` needs
 * `nativeButton={false}`.
 */
export const Triggers = () => (
  <Stack gap={2} ax="start">
    <Dialog trigger={<Button>Element trigger</Button>} title="Element trigger">
      {BODY}
    </Dialog>
    <Dialog trigger="String trigger" title="String trigger">
      {BODY}
    </Dialog>
    <Dialog
      trigger={({ open }) => (
        <Text weight="bold">{open ? "Viewing" : "Open"} function trigger</Text>
      )}
      title="Function trigger"
    >
      {BODY}
    </Dialog>
    <Dialog
      trigger={<Text weight="bold">Text trigger</Text>}
      TriggerProps={{ nativeButton: false }}
      title="Text trigger"
    >
      {BODY}
    </Dialog>
  </Stack>
);
