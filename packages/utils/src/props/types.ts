export type StyleProp<K extends keyof React.CSSProperties> = {
  property: K;
  values?: ReadonlyArray<React.CSSProperties[K]> | Array<React.CSSProperties[K]>;
  scale?: {
    variable: `--${string}`;
    unit?: "px" | "em" | "rem" | "dvh" | "dvw" | "%";
  };
};
