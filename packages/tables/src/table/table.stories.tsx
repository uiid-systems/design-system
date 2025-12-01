import type { Meta } from "@storybook/react-vite";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

import {
  TableRoot,
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCellCheckbox,
  TableCellDropdown,
  type TableProps,
} from "../";

import { TABLE_MOCK_DATA, type TableMockData } from "./table.mocks";

const meta: Meta<typeof Table> = {
  title: "Tables/Table",
  component: Table,
};

export default meta;

export const Default = {
  name: "Table",
  render: () => (
    <Stack gap={4} fullwidth>
      <DemoTable striped />
      <Card
        trim
        fullwidth
        style={{ backgroundColor: "var(--shade-background)" }}
      >
        <DemoTable bordered />
      </Card>
      <Table<TableMockData> items={TABLE_MOCK_DATA} striped bordered />
    </Stack>
  ),
};

const DemoTable = ({ striped, bordered }: TableProps) => (
  <TableContainer>
    <TableRoot striped={striped} bordered={bordered}>
      <TableHeader>
        <TableRow>
          <TableCellCheckbox head />
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {TABLE_MOCK_DATA.map((item) => (
          <TableRow key={item.id}>
            <TableCellCheckbox />
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCellDropdown />
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  </TableContainer>
);
