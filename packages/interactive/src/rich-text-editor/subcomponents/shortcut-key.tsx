import * as React from "react";

import { Kbd } from "@uiid/indicators";
import { Group } from "@uiid/layout";

import { getShortcutKey } from "../rich-text-editor.utils";

export interface ShortcutKeyProps extends React.ComponentProps<"span"> {
  keys: string[];
}

export const ShortcutKey = ({ ref, keys, ...props }: ShortcutKeyProps) => {
  const modifiedKeys = keys.map((key) => getShortcutKey(key));
  const ariaLabel = modifiedKeys
    .map((shortcut) => shortcut.readable)
    .join(" + ");

  return (
    <Group
      aria-label={ariaLabel}
      ay="center"
      gap={1}
      {...props}
      render={<Kbd ref={ref} />}
    >
      {modifiedKeys.map((shortcut) => (
        <span key={shortcut.symbol}>{shortcut.symbol}</span>
      ))}
    </Group>
  );
};
ShortcutKey.displayName = "ShortcutKey";
