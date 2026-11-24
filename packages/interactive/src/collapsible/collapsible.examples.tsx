"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Collapsible } from "./collapsible";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const Default = () => (
  <Collapsible trigger={<Button>Show details</Button>}>
    <Text>{BODY}</Text>
  </Collapsible>
);

/**
 * A string becomes a focusable `role="button"` span, and a `Button` keeps its
 * native semantics. A function receives the trigger's state and is wrapped the
 * same way as a string. A component element that renders anything other than
 * a `<button>` can't be inspected before it renders, so a static `Text` needs
 * `nativeButton={false}`.
 */
export const Triggers = () => (
  <Stack gap={4} ax="start">
    <Collapsible trigger="String trigger">
      <Text>{BODY}</Text>
    </Collapsible>
    <Collapsible trigger={<Button>Button trigger</Button>}>
      <Text>{BODY}</Text>
    </Collapsible>
    <Collapsible
      trigger={({ open }) => (
        <Text weight="bold">{open ? "Hide" : "Show"} function trigger</Text>
      )}
    >
      <Text>{BODY}</Text>
    </Collapsible>
    <Collapsible
      trigger={<Text weight="bold">Text trigger</Text>}
      TriggerProps={{ nativeButton: false }}
    >
      <Text>{BODY}</Text>
    </Collapsible>
  </Stack>
);

/** Root and panel each render a `Stack`, so both take its layout props. */
export const Layout = () => (
  <Collapsible
    trigger={<Button>Show details</Button>}
    RootProps={{ gap: 2, ax: "start" }}
    PanelProps={{ gap: 2, p: 4, b: 1 }}
  >
    <Text weight="bold">Shipping</Text>
    <Text emphasis="muted">{BODY}</Text>
  </Collapsible>
);

export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap={2} ax="start">
      <Text emphasis="muted">{open ? "Open" : "Closed"}</Text>
      <Collapsible
        trigger={<Button>Toggle</Button>}
        open={open}
        onOpenChange={setOpen}
      >
        <Text>{BODY}</Text>
      </Collapsible>
    </Stack>
  );
};

/** A panel that opens sideways. Give the content a width; the panel clips to it. */
export const Horizontal = () => {
  const [open, setOpen] = useState(true);

  return (
    <Stack gap={2} ax="start">
      <Button onClick={() => setOpen((value) => !value)}>Toggle panel</Button>
      <Group gap={4} ay="start">
        <CollapsibleRoot open={open}>
          <CollapsiblePanel
            orientation="horizontal"
            instant={false}
            keepMounted
          >
            <Stack w={240} p={4} b={1}>
              <Text weight="bold">Shipping</Text>
              <Text emphasis="muted">{BODY}</Text>
            </Stack>
          </CollapsiblePanel>
        </CollapsibleRoot>
        <Text>The content beside it takes the space it gives up.</Text>
      </Group>
    </Stack>
  );
};

/** A bare `CollapsiblePanel` is instant; pass `instant={false}` to animate. */
export const Composed = () => (
  <CollapsibleRoot gap={2} ax="start">
    <CollapsibleTrigger>
      <Button>Composed trigger</Button>
    </CollapsibleTrigger>
    <CollapsiblePanel instant={false} gap={2}>
      <Text>{BODY}</Text>
    </CollapsiblePanel>
  </CollapsibleRoot>
);
