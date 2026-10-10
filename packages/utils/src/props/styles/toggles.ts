export const togglePropKeys = [
  "evenly",
  "wrap",
  "fullwidth",
  "fullheight",
  "fullscreen",
] as const;

export type ToggleProp = {
  /** Appended to `[data-ui-{key}]`, e.g. `" > *"` to style the children. */
  selector?: string;
  declarations: readonly string[];
};

export const toggleProps = {
  /** A child that names its own `flex` keeps it; `evenly` fills in the rest. */
  evenly: {
    selector: " > :not([data-ui-flex])",
    declarations: [
      "flex: 1",
      "flex-basis: auto",
      "width: -webkit-fill-available",
      "width: 100%",
    ],
  },
  wrap: {
    declarations: ["flex-wrap: wrap"],
  },
  fullwidth: {
    declarations: [
      "width: 100%",
      "width: -webkit-fill-available",
      "width: -moz-available",
    ],
  },
  fullheight: {
    declarations: ["height: 100%", "height: -webkit-fill-available"],
  },
  fullscreen: {
    declarations: ["width: 100dvw", "height: 100dvh"],
  },
} satisfies Record<(typeof togglePropKeys)[number], ToggleProp>;

export type ToggleProps = {
  /** Distribute children evenly along the main axis */
  evenly?: boolean;
  /** Let children wrap onto new lines instead of shrinking */
  wrap?: boolean;
  /** Stretch to fill the container width */
  fullwidth?: boolean;
  /** Stretch to fill the container height */
  fullheight?: boolean;
  /** Fill the viewport */
  fullscreen?: boolean;
};
