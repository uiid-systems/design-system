"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { CollapsiblePanelProps } from "../collapsible.types";

import styles from "../collapsible.module.css";

export const CollapsiblePanel = ({
  orientation = "vertical",
  ax,
  ay,
  minw,
  minh,
  instant = true,
  className,
  children,
  ...props
}: CollapsiblePanelProps) => {
  const horizontal = orientation === "horizontal";

  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      /*
       * The layout props are destructured rather than written on the `Stack`
       * as literals: Base UI merges the render element's own props over the
       * part's, so a literal there would beat the caller's value every time.
       * Content is pinned to the edge the panel closes toward (`ay="end"`, or
       * `ax="end"` when horizontal), so it slides out rather than reflowing.
       * The minimum on the animating axis is 0 because the panel is a flex
       * item, whose `auto` minimum would stop it shrinking to 0 as it closes.
       */
      render={
        <Stack
          ax={ax ?? (horizontal ? "end" : undefined)}
          ay={ay ?? (horizontal ? undefined : "end")}
          minw={minw ?? (horizontal ? 0 : undefined)}
          minh={minh ?? (horizontal ? undefined : 0)}
        />
      }
      className={cxState(styles["collapsible-panel"], className)}
      data-orientation={orientation}
      data-instant={instant ? "" : undefined}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  );
};
CollapsiblePanel.displayName = "CollapsiblePanel";
