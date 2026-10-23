import { keysOf } from "../utils";

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
  /** The zero minimums let a scrolling descendant scroll instead of stretching the page. */
  grow: {
    declarations: ["flex: 1", "min-width: 0", "min-height: 0"],
  },
} satisfies Record<keyof ToggleProps, ToggleProp>;

export const togglePropKeys = keysOf(toggleProps);

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
  /** Take the flex parent's leftover space, shrinking below its content if needed */
  grow?: boolean;
};
