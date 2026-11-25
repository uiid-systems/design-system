"use client";

import { Card, type CardProps, type InnerContainerProps } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { useScrollAffordance } from "../hooks";

import styles from "../table.module.css";

export type TableContainerProps = Omit<CardProps, "InnerContainerProps"> & {
  /** Bound the scroller's height so it scrolls vertically. Wins over a
   * `maxHeight` in `InnerContainerProps.style`. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /** Reaches the scroller. Its `ref` is set by TableContainer itself. */
  InnerContainerProps?: Omit<InnerContainerProps, "ref">;
};

export const TableContainer = ({
  children,
  className,
  maxHeight,
  InnerContainerProps,
  ...props
}: TableContainerProps) => {
  const { scrollerRef, scrollState } = useScrollAffordance();

  const {
    className: innerClassName,
    style: innerStyle,
    ...innerProps
  } = InnerContainerProps ?? {};

  return (
    <Card
      data-slot="table-container"
      className={cx(styles["table-container"], className)}
      p={0}
      w="full"
      {...scrollState}
      {...props}
      /* The inner container scrolls rather than the Card, so the Card can
         paint edge shadows that stay put while the table moves underneath. */
      InnerContainerProps={{
        "data-slot": "table-scroller",
        my: 0,
        ...innerProps,
        ref: scrollerRef,
        className: cx(styles["table-scroller"], innerClassName),
        style: maxHeight != null ? { ...innerStyle, maxHeight } : innerStyle,
      }}
    >
      {children}
    </Card>
  );
};
TableContainer.displayName = "TableContainer";
