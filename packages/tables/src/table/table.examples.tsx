"use client";

import { Button } from "@uiid/buttons";
import { PencilIcon } from "@uiid/icons/pencil";
import { StarIcon } from "@uiid/icons/star";
import { Group, Stack } from "@uiid/layout";
import { useState } from "react";

import {
  TableBody,
  TableCell,
  TableCellCheckbox,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./subcomponents";
import { Table } from "./table";
import { TableSelectionProvider } from "./table-selection";
import { useTableSelection } from "./table-selection.context";
import { TABLE_MOCK_DATA, type TableMockData } from "./table.mocks";
import type { TableRowId } from "./table.types";
import { defaultFormatCell } from "./table.utils";

/* ---------------------------------------------------------------------------
 * Data-driven: pass `items`, and Table renders the header, rows and cells.
 * ------------------------------------------------------------------------- */

/* With no `columns`, every key of the first item is a column, in key order. */
export const Default = () => <Table<TableMockData> items={TABLE_MOCK_DATA} />;

const HEADERS: Record<string, string> = {
  name: "Customer",
  status: "Status",
  balance: "Balance (USD)",
};

/* `columns` picks and orders the keys; `formatHeader` labels them. */
export const Columns = () => (
  <Table<TableMockData>
    items={TABLE_MOCK_DATA}
    columns={["name", "status", "balance"]}
    formatHeader={(column) => HEADERS[column]}
  />
);

/*
 * `formatCell` renders a cell from its value, column and row. Hand the cells
 * you don't handle to `defaultFormatCell`.
 */
export const FormatCell = () => (
  <Table<TableMockData>
    items={TABLE_MOCK_DATA}
    columns={["name", "email", "location"]}
    formatCell={(value, column, item) =>
      column === "email" ? (
        <a href={`mailto:${item.email}`}>{item.email}</a>
      ) : (
        defaultFormatCell(value)
      )
    }
  />
);

export const Striped = () => (
  <Table<TableMockData>
    items={TABLE_MOCK_DATA}
    columns={["name", "email", "status"]}
    striped
    bordered
    highlightOnHover
  />
);

/* Row height, font size and cell padding follow the form-control tiers. */
export const Sizes = () => (
  <Stack gap={6} w="full">
    {(["xsmall", "small", "medium", "large"] as const).map((size) => (
      <Table<TableMockData>
        key={size}
        size={size}
        items={TABLE_MOCK_DATA.slice(0, 2)}
        columns={["name", "email", "status"]}
        aria-label={`Customers, ${size}`}
        footer={size}
      />
    ))}
  </Stack>
);

/*
 * `selectable` adds a checkbox column. `getRowId` keys the selection by
 * record, so it follows a row when `items` are sorted, filtered or paged.
 */
export const Selection = () => {
  const [selected, setSelected] = useState<TableRowId[]>(["2"]);

  return (
    <Table<TableMockData>
      items={TABLE_MOCK_DATA}
      columns={["name", "email", "status"]}
      selectable
      getRowId={(item) => item.id}
      getRowLabel={(item) => `Select ${item.name}`}
      selectedRows={selected}
      onSelectedRowsChange={setSelected}
      footer={`${selected.length} of ${TABLE_MOCK_DATA.length} selected`}
    />
  );
};

/*
 * `primary` actions render as icon buttons named by their `tooltip`.
 * `secondary` is the row's overflow menu; as a function of the row, each
 * entry knows which row opened it.
 */
export const Actions = () => {
  const [last, setLast] = useState("No action yet");

  return (
    <Table<TableMockData>
      items={TABLE_MOCK_DATA}
      columns={["name", "email"]}
      actions={{
        primary: [
          {
            icon: StarIcon,
            tooltip: "Favorite",
            onClick: (item) => setLast(`Favorited ${item.name}`),
          },
          {
            icon: PencilIcon,
            tooltip: "Edit",
            onClick: (item) => setLast(`Editing ${item.name}`),
          },
        ],
        secondary: {
          items: (item) => [
            {
              label: "Copy email",
              value: "copy",
              onClick: () => setLast(`Copied ${item.email}`),
            },
            {
              label: "Deactivate",
              value: "deactivate",
              disabled: item.status === "Inactive",
              onClick: () => setLast(`Deactivated ${item.name}`),
            },
          ],
        },
      }}
      footer={<span role="status">{last}</span>}
    />
  );
};

/*
 * `maxHeight` bounds the scroller. `stickyHeader` and `stickyFooter` pin the
 * header, select-all checkbox included, and the `footer` row while the body
 * scrolls under them.
 */
export const StickyHeader = () => (
  <Table<TableMockData>
    items={[...TABLE_MOCK_DATA, ...TABLE_MOCK_DATA].map((item, index) => ({
      ...item,
      id: String(index),
    }))}
    getRowId={(item) => item.id}
    columns={["name", "email", "location"]}
    selectable
    striped
    maxHeight={240}
    stickyHeader
    stickyFooter
    footer="10 users"
  />
);

/* `minw` floors the table, so a narrower container scrolls it sideways. */
export const HorizontalScroll = () => (
  <Stack maxw={480} w="full">
    <Table<TableMockData> items={TABLE_MOCK_DATA} minw={768} bordered />
  </Stack>
);

/* ---------------------------------------------------------------------------
 * Composed: build the table from its parts for markup the data-driven form
 * can't express, such as spanning cells or grouped rows.
 * ------------------------------------------------------------------------- */

const STATUSES = ["Active", "Inactive"];

/*
 * `TableContainer` is the scrolling card; `TableRoot` is the `<table>`. Each
 * group is its own `TableBody`, so its header row, `scope="rowgroup"`, labels
 * only the rows of its group.
 */
export const Composed = () => (
  <TableContainer>
    <TableRoot bordered aria-label="Customers by status">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>
      {STATUSES.map((status) => (
        <StatusGroup key={status} status={status} />
      ))}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>{TABLE_MOCK_DATA.length} users</TableCell>
        </TableRow>
      </TableFooter>
    </TableRoot>
  </TableContainer>
);

const StatusGroup = ({ status }: { status: string }) => (
  <TableBody>
    <TableRow>
      <TableHead colSpan={3} scope="rowgroup">
        {status}
      </TableHead>
    </TableRow>
    {TABLE_MOCK_DATA.filter((item) => item.status === status).map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.location}</TableCell>
        <TableCell>{item.balance}</TableCell>
      </TableRow>
    ))}
  </TableBody>
);

/* Reads the selection from the nearest `TableSelectionProvider`. */
const SelectAllButton = () => {
  const { allSelected, toggleAll } = useTableSelection();

  return (
    <Button
      size="small"
      variant="subtle"
      onClick={() => toggleAll(!allSelected)}
    >
      {allSelected ? "Clear selection" : "Select all"}
    </Button>
  );
};

/*
 * A composed table with selection wraps everything in a
 * `TableSelectionProvider`, gives it the row ids, and gives each row's
 * `TableCellCheckbox` its `rowId`. `useTableSelection` reads the same state
 * for UI outside the table, such as a bulk-action bar.
 */
export const ComposedSelection = () => {
  const [selected, setSelected] = useState<TableRowId[]>([]);

  return (
    <TableSelectionProvider
      rowIds={TABLE_MOCK_DATA.map((item) => item.id)}
      selectedRows={selected}
      onSelectedRowsChange={setSelected}
    >
      <Stack gap={3} w="full">
        <Group gap={2} ay="center">
          <SelectAllButton />
        </Group>
        <TableContainer>
          <TableRoot highlightOnHover>
            <TableHeader>
              <TableRow>
                <TableCellCheckbox head />
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TABLE_MOCK_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCellCheckbox
                    rowId={item.id}
                    label={`Select ${item.name}`}
                  />
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>{selected.length} selected</TableCell>
              </TableRow>
            </TableFooter>
          </TableRoot>
        </TableContainer>
      </Stack>
    </TableSelectionProvider>
  );
};
