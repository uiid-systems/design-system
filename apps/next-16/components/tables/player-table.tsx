"use client";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Select, Input } from "@uiid/forms";
import { Filter } from "@uiid/icons";
import { Menu } from "@uiid/interactive";
import { Stack, Group } from "@uiid/layout";
import { Pagination } from "@uiid/navigation";
import { Table } from "@uiid/tables";
import { Text } from "@uiid/typography";

import {
  TABLE_MOCK_DATA,
  TABLE_MOCK_ACTIONS,
  TABLE_MOCK_MORE_ACTIONS,
  TABLE_MOCK_FILTERS,
  TABLE_MOCK_COLUMNS,
} from "./MOCK_DATA";

export const PlayerTable = () => {
  return (
    <Stack gap={4} fullwidth>
      <Text size={4} weight="bold">
        Player directory
      </Text>
      <Group gap={2} ay="center" ax="space-between" fullwidth>
        <Menu
          items={TABLE_MOCK_FILTERS}
          trigger={
            <Button variant="subtle" size="small">
              <Filter />
              Filters
            </Button>
          }
        />
        <Input
          aria-label="Search players"
          placeholder="Search players"
          size="small"
        />
      </Group>
      <Card
        trimmed
        fullwidth
        className="overflow-hidden bg-(--shade-background)"
      >
        <Table
          columns={TABLE_MOCK_COLUMNS}
          items={TABLE_MOCK_DATA}
          actions={{
            primary: TABLE_MOCK_ACTIONS,
            secondary: TABLE_MOCK_MORE_ACTIONS,
          }}
          selectable
          bordered
        />
      </Card>
      <Group gap={2} ax="space-between" fullwidth>
        <Select
          aria-label="Select a page size"
          size="sm"
          items={[
            { label: "20 rows per page", value: "20" },
            { label: "50 rows per page", value: "50" },
            { label: "100 rows per page", value: "100" },
          ]}
        />

        <Pagination />
      </Group>
    </Stack>
  );
};
PlayerTable.displayName = "PlayerTable";
