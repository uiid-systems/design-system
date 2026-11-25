import type { Meta } from "@storybook/react-vite";
import { defaultFormatCell, Stack, Table } from "@uiid/design-system";

import * as Examples from "../../../../packages/tables/src/table/table.examples";
import {
  TABLE_MOCK_DATA,
  type TableMockData,
  TABLE_MOCK_MORE_ACTIONS,
  TABLE_MOCK_ACTIONS,
} from "./table.mocks";

const meta: Meta<typeof Table> = {
  title: "Tables/Table",
  component: Table,
};

export default meta;

export const Default = {
  name: "Table",
  tags: ["new"],
  render: () => (
    <Stack gap={4} w="full">
      <Table<TableMockData>
        selectable
        items={TABLE_MOCK_DATA}
        actions={{
          primary: TABLE_MOCK_ACTIONS,
          secondary: TABLE_MOCK_MORE_ACTIONS,
        }}
        striped
        bordered
        highlightOnHover
        footer={`${TABLE_MOCK_DATA.length} users`}
      />
    </Stack>
  ),
};

/* With no `columns`, every key of the first item is a column. */
export const Basic = { render: () => <Examples.Default /> };

export const Columns = { render: () => <Examples.Columns /> };

export const FormatCell = {
  name: "Format Cell",
  render: () => <Examples.FormatCell />,
};

export const Striped = { render: () => <Examples.Striped /> };

/* Row height, font size and cell padding follow the form-control tiers. */
export const Sizes = { render: () => <Examples.Sizes /> };

export const Selection = { render: () => <Examples.Selection /> };

export const Actions = { render: () => <Examples.Actions /> };

export const StickyHeader = {
  name: "Sticky Header + Footer",
  render: () => <Examples.StickyHeader />,
};

/* No minimum width by default, so a short table fits a narrow column
   without scrolling. */
export const Narrow = {
  name: "Narrow Column",
  tags: ["new"],
  render: () => (
    <Stack gap={4} maxw={320} w="full">
      <Table<TableMockData>
        items={TABLE_MOCK_DATA}
        columns={["name", "balance"]}
        bordered
      />
    </Stack>
  ),
};

/* A table is as wide as its container by default. `minw` floors it, so a
   narrower container forces the horizontal overflow that the edge shadows
   respond to. */
export const HorizontalScroll = {
  name: "Horizontal Scroll",
  render: () => <Examples.HorizontalScroll />,
};

export const HorizontalAndVerticalScroll = {
  name: "Horizontal + Vertical Scroll",
  tags: ["new"],
  render: () => (
    <Stack gap={4} maxw={560} w="full">
      <Table<TableMockData>
        minw={768}
        stickyHeader
        maxHeight={220}
        items={TABLE_MOCK_DATA}
        striped
        bordered
        highlightOnHover
        footer={`${TABLE_MOCK_DATA.length} users`}
      />
    </Stack>
  ),
};

const CELL_VALUES_DATA: Record<string, unknown>[] = [
  {
    name: "Alex Thompson",
    email: "alex.t@company.com",
    joined: new Date(2024, 0, 15),
    teams: ["Design", "Platform"],
    address: { city: "London" },
  },
  {
    name: "Sarah Chen",
    email: null,
    joined: new Date(2025, 5, 2),
    teams: [],
    address: { city: "Singapore" },
  },
  { name: "James Wilson", joined: new Date(2023, 10, 28) },
];

/* A missing key, `null` and a plain object leave the cell empty. `formatCell`
   takes over the cells it names and hands the rest to `defaultFormatCell`. */
export const CellValues = {
  name: "Cell Values",
  tags: ["new"],
  render: () => (
    <Stack gap={8} w="full">
      <Table items={CELL_VALUES_DATA} bordered footer="Default" />
      <Table
        items={CELL_VALUES_DATA}
        formatCell={(value, column) =>
          column === "joined" && value instanceof Date
            ? value.toLocaleDateString("en-US", { dateStyle: "medium" })
            : defaultFormatCell(value)
        }
        bordered
        footer="formatCell"
      />
    </Stack>
  ),
};

/* Built from the parts: a group header row per status and a spanning footer. */
export const Composed = { render: () => <Examples.Composed /> };

/* A composed table with a selection provider and a bar that reads it. */
export const ComposedSelection = {
  name: "Composed Selection",
  render: () => <Examples.ComposedSelection />,
};
