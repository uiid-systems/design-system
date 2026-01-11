"use client";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";
import { Table } from "@uiid/tables";
import { Text } from "@uiid/typography";

import {
  TABLE_MOCK_DATA,
  TABLE_MOCK_ACTIONS,
  TABLE_MOCK_MORE_ACTIONS,
  TABLE_MOCK_COLUMNS,
} from "./MOCK_DATA";

export const PlayerTable = () => {
  return (
    <Card trimmed fullwidth transparent className="overflow-hidden">
      <Table
        columns={TABLE_MOCK_COLUMNS}
        items={TABLE_MOCK_DATA}
        actions={{
          primary: TABLE_MOCK_ACTIONS,
          secondary: TABLE_MOCK_MORE_ACTIONS,
        }}
        bordered
      />
    </Card>
  );
};
PlayerTable.displayName = "PlayerTable";
