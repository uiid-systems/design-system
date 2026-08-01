import type { Meta } from "@storybook/react-vite";
import { Stack, Table } from "@uiid/design-system";

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
    <Stack gap={4} fullwidth>
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

export const StickyHeader = {
  name: "Sticky Header",
  tags: ["new"],
  render: () => (
    <Stack gap={4} fullwidth>
      <Table<TableMockData>
        stickyHeader
        maxHeight={220}
        selectable
        items={TABLE_MOCK_DATA}
        striped
        bordered
        highlightOnHover
      />
    </Stack>
  ),
};

export const StickyHeaderFooter = {
  name: "Sticky Header + Footer",
  tags: ["new"],
  render: () => (
    <Stack gap={4} fullwidth>
      <Table<TableMockData>
        stickyHeader
        stickyFooter
        maxHeight={220}
        selectable
        items={TABLE_MOCK_DATA}
        striped
        bordered
        highlightOnHover
        footer={`${TABLE_MOCK_DATA.length} users`}
      />
    </Stack>
  ),
};
