export type KbdProps = Omit<React.ComponentProps<"kbd">, "children"> & {
  /** Manually control the active state. Overrides automatic hotkey detection. */
  active?: boolean;
  /** Keys to listen for and display (e.g. ["meta", "b"] renders "⌘ + B"). */
  hotkey?: string[];
};
