"use client";

import { cx } from "@uiid/utils";

import type { TableProps } from "./table.types";
import styles from "./table.module.css";

import {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCellDropdown,
  TableCellCheckbox,
} from "./subcomponents";

const Table = ({ striped, bordered, className, ...props }: TableProps) => {
  return (
    <div data-slot="table-container" className={styles["table-container"]}>
      <table
        data-slot="table"
        data-striped={striped}
        data-bordered={bordered}
        className={cx(styles["table"], className)}
        {...props}
      />
    </div>
  );
};
Table.displayName = "Table";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCellDropdown,
  TableCellCheckbox,
};
