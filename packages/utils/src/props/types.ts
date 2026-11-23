/**
 * Props for a Base UI part whose `render` is a layout primitive (`Stack`,
 * `Group`, `Card`, ...). Layout props spread onto the part pass straight
 * through to the primitive, so the part accepts them too.
 *
 * Every key the Base UI part already ships stays Base UI's. A plain
 * intersection would narrow `render` to the primitive's element form,
 * rejecting the state function Base UI accepts. A part whose `className` is a
 * string says so by passing `WithStringClassName<BaseProps>` here.
 * The native attributes Base UI deliberately drops (`color`, `defaultValue`,
 * `defaultChecked`) stay dropped rather than returning through the primitive.
 */
export type WithLayoutProps<BaseProps, LayoutProps> = BaseProps &
  Omit<
    LayoutProps,
    keyof BaseProps | "color" | "defaultValue" | "defaultChecked"
  >;

/**
 * A Base UI part's props with `className` narrowed to a string. Base UI also
 * takes a function of the part's state there, but `cx` has no state to call
 * one with, so a UIID part takes a string and merges it with its own class.
 * Style a state through the `data-*` attribute Base UI sets for it instead.
 */
export type WithStringClassName<Props> = Omit<Props, "className"> & {
  className?: string;
};

export type StyleProp<K extends keyof React.CSSProperties> = {
  property: K;
  values?: ReadonlyArray<React.CSSProperties[K]>;
  /**
   * Keywords accepted alongside a number, each emitted as its own rule. A
   * keyword maps to the values it declares, in order, so it can carry a
   * fallback chain (`100%`, then `-webkit-fill-available`).
   */
  keywords?: Readonly<Record<string, readonly string[]>>;
  /**
   * How the raw value becomes a length: multiplied by a token variable,
   * multiplied by `1px`, or used as-is (`"none"`, for keyword values).
   */
  unit: { variable: `--${string}` } | "px" | "none";
};
