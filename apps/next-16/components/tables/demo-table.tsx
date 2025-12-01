"use client";

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

export const DemoTable = () => {
  return (
    <Table
      formatHeader={(key) => key.toUpperCase()}
      items={TABLE_MOCK_DATA}
      striped
      bordered
    />
  );
};
