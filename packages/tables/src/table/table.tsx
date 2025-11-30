"use client";

import { cx } from "@uiid/utils";

import styles from "./table.module.css";

import {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from "./subcomponents";

const Table = ({ className, ...props }: React.ComponentProps<"table">) => {
  return (
    <div data-slot="table-container" className={styles["table-container"]}>
      <table
        data-slot="table"
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
};
