export type StyleProp<K extends keyof React.CSSProperties> = {
  property: K;
  values?: ReadonlyArray<React.CSSProperties[K]> | Array<React.CSSProperties[K]>;
  unit?: {
    variable: `--${string}`;
    suffix?: "px" | "em" | "rem" | "dvh" | "dvw" | "%";
  };
};
