import { SPACING_VALUES } from "./constants";

export type SpacingValues = (typeof SPACING_VALUES)[number];

export type StyleProp<K extends keyof React.CSSProperties> = {
  property: K;
  values: Array<React.CSSProperties[K] | number>;
  scale?: {
    variable: `--${string}`;
    unit?: "px" | "em" | "rem" | "dvh" | "dvw" | "%";
  };
};

export type StyleProps<
  P extends Record<string, StyleProp<keyof React.CSSProperties>>,
> = {
  [K in keyof P]?: P[K]["values"][number];
};
