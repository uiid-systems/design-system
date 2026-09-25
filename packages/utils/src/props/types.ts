/**
 * Props for a Base UI part whose `render` is a layout primitive (`Stack`,
 * `Group`, `Card`, ...). Layout props spread onto the part pass straight
 * through to the primitive, so the part accepts them too.
 *
 * Every key the Base UI part already ships stays Base UI's. A plain
 * intersection would narrow `className` and `render` to the primitive's
 * string and element forms, rejecting the state functions Base UI accepts.
 * The native attributes Base UI deliberately drops (`color`, `defaultValue`,
 * `defaultChecked`) stay dropped rather than returning through the primitive.
 */
export type WithLayoutProps<BaseProps, LayoutProps> = BaseProps &
  Omit<
    LayoutProps,
    keyof BaseProps | "color" | "defaultValue" | "defaultChecked"
  >;

/**
 * Breakpoints, smallest first. `@uiid/tokens` sets `--bp-{name}: true` on
 * `:root` from each one up, so a later breakpoint's rules win.
 */
export const BREAKPOINTS = ["sm"] as const;

export type Breakpoint = (typeof BREAKPOINTS)[number];

/** A value, or one per breakpoint. A breakpoint left out keeps the one below. */
export type Responsive<T> = T | ({ base: T } & Partial<Record<Breakpoint, T>>);

export type StyleProp<K extends keyof React.CSSProperties> = {
  property: K;
  values?:
    | ReadonlyArray<React.CSSProperties[K]>
    | Array<React.CSSProperties[K]>;
  /** Keywords accepted alongside a number, each emitted as its own rule. */
  keywords?: readonly string[];
  /** Accepts a value per breakpoint; see `Responsive`. */
  responsive?: boolean;
  unit?: {
    variable: `--${string}`;
  };
};
