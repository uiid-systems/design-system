"use client";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Select, Autocomplete } from "@uiid/forms";
import { Filter, Search } from "@uiid/icons";
import { Menu } from "@uiid/interactive";
import { Stack, Group } from "@uiid/layout";
import { Table } from "@uiid/tables";
import { Pagination } from "@uiid/navigation";

import {
  TABLE_MOCK_DATA,
  TABLE_MOCK_ACTIONS,
  TABLE_MOCK_MORE_ACTIONS,
  TABLE_MOCK_FILTERS,
  TABLE_MOCK_COLUMNS,
} from "./MOCK_DATA";

export const DemoTable = () => {
  return (
    <Stack gap={4} fullwidth>
      <Group gap={2} ay="center" ax="space-between" fullwidth>
        {/**
         * @todo remove css targeting autocomplete after fix
         * @see https://github.com/uiid-systems/design-system/issues/3
         * */}
        <div className="[&~*]:w-auto">
          <Menu
            items={TABLE_MOCK_FILTERS}
            trigger={
              <Button
                variant="subtle"
                size="sm"
                icon={<Filter size={14} />}
                iconPosition="before"
              >
                Filters
              </Button>
            }
          />
        </div>
        <Autocomplete
          aria-label="Search players"
          placeholder="Search players"
          size="sm"
          before={<Search size={14} />}
          items={TABLE_MOCK_DATA.map((item) => ({
            value: item.id as string,
            label: item.name as string,
          }))}
        />
      </Group>
      <Card trim fullwidth className="overflow-hidden bg-(--shade-background)">
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
          options={[
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
DemoTable.displayName = "DemoTable";
