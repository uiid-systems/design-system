import type { Meta } from "@storybook/react-vite";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

import { Table } from "../";

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
  render: () => (
    <Stack gap={4} fullwidth>
      <Card
        trimmed
        fullwidth
        style={{ backgroundColor: "var(--shade-background)" }}
      >
        <Table<TableMockData>
          selectable
          items={TABLE_MOCK_DATA}
          actions={{
            primary: TABLE_MOCK_ACTIONS,
            secondary: TABLE_MOCK_MORE_ACTIONS,
          }}
          striped
          bordered
        />
      </Card>
    </Stack>
  ),
};
