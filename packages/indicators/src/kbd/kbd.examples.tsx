import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Kbd } from "./kbd";

export const Default = () => <Kbd hotkey={["meta", "k"]} />;

/* Modifiers and named keys render as symbols; other keys are uppercased. */
export const Symbols = () => (
  <Group gap={2} wrap>
    <Kbd hotkey={["meta"]} />
    <Kbd hotkey={["ctrl"]} />
    <Kbd hotkey={["alt"]} />
    <Kbd hotkey={["shift"]} />
    <Kbd hotkey={["enter"]} />
    <Kbd hotkey={["escape"]} />
    <Kbd hotkey={["tab"]} />
    <Kbd hotkey={["arrowup"]} />
    <Kbd hotkey={["meta", "shift", "p"]} />
  </Group>
);

/* Press the shortcut: the key lights up while it is held. */
export const Hotkey = () => (
  <Group gap={2} ay="center">
    <Text emphasis="muted">Press</Text>
    <Kbd hotkey={["shift", "k"]} />
  </Group>
);

/*
 * `active` takes over from the listener, for a key the app presses itself or
 * a still frame in documentation.
 */
export const Active = () => (
  <Group gap={2}>
    <Kbd hotkey={["enter"]} active={false} />
    <Kbd hotkey={["enter"]} active />
  </Group>
);
