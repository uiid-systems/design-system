"use client";

import {
  Box,
  Group,
  Stack,
  type GroupProps,
  type StackProps,
} from "@uiid/layout";
import { cx, stylePropKeys, togglePropKeys } from "@uiid/utils";

import { useListMarker } from "../list.context";

import styles from "../list.module.css";

const LAYOUT_PROP_KEYS = new Set<string>([...stylePropKeys, ...togglePropKeys]);

/** `item` lays out as a `Group`, `group` as a `Stack`. */
type ListRowProps =
  | ({ kind: "item" } & GroupProps)
  | ({ kind: "group" } & StackProps);

/**
 * @internal The `<li>` behind `ListItem` and `ListGroup`.
 *
 * In an unmarked List the `<li>` is the row's flex layout, as it always was. In
 * a marked one the `<li>` is a native list item, so the browser draws and
 * counts its marker, and a list item can't also be a flex container. The row's
 * layout props (`ax`, `ay`, `gap`, spacing, sizing) move to an inner flex
 * element so the row keeps its layout, while `className`, `render` and DOM
 * attributes stay on the `<li>`.
 */
export const ListRow = (allProps: ListRowProps) => {
  // The union only narrows what each caller may pass. Group and Stack take the
  // same props object, so the body handles both as a Group's.
  const { kind, render, className, children, ...props } = allProps as {
    kind: ListRowProps["kind"];
  } & GroupProps;
  const marker = useListMarker();
  const Layout = kind === "item" ? Group : (Stack as typeof Group);
  const slot = `list-${kind}`;
  const rowClassName = cx(styles[slot], className);

  if (marker === "none") {
    return (
      <Layout
        data-slot={slot}
        render={render ?? <li />}
        className={rowClassName}
        {...props}
      >
        {children}
      </Layout>
    );
  }

  const layoutProps: Record<string, unknown> = {};
  const rowProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    (LAYOUT_PROP_KEYS.has(key) ? layoutProps : rowProps)[key] = value;
  }

  return (
    <Box
      data-slot={slot}
      data-list-marker={marker}
      render={render ?? <li />}
      className={rowClassName}
      {...rowProps}
    >
      <Layout data-slot={`${slot}-layout`} {...layoutProps}>
        {children}
      </Layout>
    </Box>
  );
};
ListRow.displayName = "ListRow";

/**
 * @internal A group's nested list: an `<ol>` under a decimal marker, otherwise
 * a `<ul>`, so a nested numbered group is an ordered list like its parent.
 */
export const ListGroupPanel = ({ children }: { children: React.ReactNode }) => {
  const marker = useListMarker();
  const Panel = marker === "decimal" ? "ol" : "ul";
  return (
    <Panel data-slot="list-group-panel" className={styles["list-group-panel"]}>
      {children}
    </Panel>
  );
};
ListGroupPanel.displayName = "ListGroupPanel";
