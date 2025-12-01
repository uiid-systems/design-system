"use client";

import { Card } from "@uiid/cards";
import { Table } from "@uiid/tables";

const TABLE_MOCK_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@example.com",
  },
  {
    id: 4,
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
];

export const TABLE_MOCK_ACTIONS = {
  tooltip: "Settings",
  items: [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ],
};

export const DemoTable = () => {
  return (
    <Card trim fullwidth className="overflow-hidden bg-(--shade-background)">
      <Table
        items={TABLE_MOCK_DATA}
        actions={TABLE_MOCK_ACTIONS}
        formatHeader={(key) => key.toUpperCase()}
        striped
        bordered
      />
    </Card>
  );
};
