import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCellDropdown,
} from "./table";
import type { TableProps } from "./table.types";

const meta: Meta<typeof Table> = {
  title: "Tables/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_DATA = [
  {
    balance: "$1,250.00",
    email: "alex.t@company.com",
    id: "1",
    location: "San Francisco, US",
    name: "Alex Thompson",
    status: "Active",
  },
  {
    balance: "$600.00",
    email: "sarah.c@company.com",
    id: "2",
    location: "Singapore",
    name: "Sarah Chen",
    status: "Active",
  },
  {
    balance: "$650.00",
    email: "j.wilson@company.com",
    id: "3",
    location: "London, UK",
    name: "James Wilson",
    status: "Inactive",
  },
  {
    balance: "$0.00",
    email: "m.garcia@company.com",
    id: "4",
    location: "Madrid, Spain",
    name: "Maria Garcia",
    status: "Active",
  },
  {
    balance: "-$1,000.00",
    email: "d.kim@company.com",
    id: "5",
    location: "Seoul, KR",
    name: "David Kim",
    status: "Active",
  },
];

export const Default: Story = {
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
    </Stack>
  ),
};

const DemoTable = ({ striped, bordered }: TableProps) => (
  <Table striped={striped} bordered={bordered}>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>ID</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Status</TableHead>
        <TableHead> </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {MOCK_DATA.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.location}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCellDropdown />
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
