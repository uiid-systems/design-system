"use client";

import { Card, type CardProps } from "@uiid/cards";
import { cx } from "@uiid/utils";

import { useScrollAffordance } from "../hooks";

import styles from "../table.module.css";

type TableContainerProps = CardProps & {
  maxHeight?: React.CSSProperties["maxHeight"];
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

  /* The inner container scrolls rather than the Card, so the Card can paint
     edge shadows that stay put while the table moves underneath them. Declared
     out here because StackProps types no data-* attributes. */
  const scrollerProps = {
    "data-slot": "table-scroller",
    my: 0,
    ...innerProps,
    ref: scrollerRef,
    className: cx(styles["table-scroller"], innerClassName),
    style: maxHeight != null ? { maxHeight, ...innerStyle } : innerStyle,
  };

  return (
    <Card
      data-slot="table-container"
      className={cx(styles["table-container"], className)}
      ax="stretch"
      p={0}
      fullwidth
      {...scrollState}
      {...props}
      InnerContainerProps={scrollerProps}
    >
      {children}
    </Card>
  );
};
TableContainer.displayName = "TableContainer";
