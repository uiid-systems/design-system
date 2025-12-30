"use client";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";
import { Table } from "@uiid/tables";
import { Text } from "@uiid/typography";

import { FIND_A_MATCH_MOCK_COLUMNS, FIND_A_MATCH_MOCK_DATA } from "./MOCK_DATA";

export const FindAMatch = () => {
  return (
    <Stack gap={4} fullwidth>
      <Text size={4} bold>
        Find a match
      </Text>
      <Card
        trimmed
        fullwidth
        className="overflow-hidden bg-(--shade-background)"
      >
        <Table
          columns={FIND_A_MATCH_MOCK_COLUMNS}
          items={FIND_A_MATCH_MOCK_DATA}
        />
      </Card>
    </Stack>
  );
};
FindAMatch.displayName = "FindAMatch";
