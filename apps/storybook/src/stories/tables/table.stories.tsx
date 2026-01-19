import type { Meta } from "@storybook/react-vite";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";
import { Table } from "@uiid/tables";

type TableMockData = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
};

const TABLE_MOCK_DATA: TableMockData[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", department: "Engineering" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", department: "Design" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User", department: "Marketing" },
];

const TABLE_MOCK_ACTIONS = [
  { label: "Edit", onClick: () => console.log("Edit") },
  { label: "Delete", onClick: () => console.log("Delete") },
];

const TABLE_MOCK_MORE_ACTIONS = [
  { label: "View Details", onClick: () => console.log("View") },
  { label: "Export", onClick: () => console.log("Export") },
];

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
