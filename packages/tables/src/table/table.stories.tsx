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
  TableCellDropdown,
  type TableProps,
} from "../";

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
      <PlayerTable striped />

      <Card
        trim
        fullwidth
        style={{ backgroundColor: "var(--shade-background)" }}
      >
        <PlayerTable bordered />
      </Card>

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
    </Stack>
  ),
};

const PlayerTable = ({
  striped,
  bordered,
}: Pick<TableProps, "striped" | "bordered">) => (
  <TableContainer>
    <TableRoot striped={striped} bordered={bordered}>
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
        {TABLE_MOCK_DATA.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              <TableCellDropdown
                items={[
                  { label: "Edit", value: "edit" },
                  { label: "Delete", value: "delete" },
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  </TableContainer>
);
