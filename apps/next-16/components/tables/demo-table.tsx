"use client";

import { Card } from "@uiid/cards";
import { Swords, Star, Heart } from "@uiid/icons";
import { Table, type TableProps } from "@uiid/tables";

const TABLE_MOCK_DATA: TableProps["items"] = [
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

const TABLE_MOCK_ACTIONS: TableProps["actions"] = [
  {
    icon: <Swords />,
    tooltip: "Challenge",
    onClick: () => console.log("Delete"),
  },
  {
    icon: <Star />,
    tooltip: "Favorite",
    onClick: () => console.log("Favorite"),
  },
  {
    icon: <Heart />,
    tooltip: "Like",
    onClick: () => console.log("Like"),
  },
];

const MOCK_TABLE_MORE_ACTIONS: TableProps["moreActions"] = {
  tooltip: "More actions",
  items: [
    { label: "View profile", value: "view-profile" },
    { label: "Delete", value: "delete" },
  ],
};

export const DemoTable = () => {
  return (
    <Card trim fullwidth className="overflow-hidden bg-(--shade-background)">
      <Table
        items={TABLE_MOCK_DATA}
        actions={TABLE_MOCK_ACTIONS}
        moreActions={MOCK_TABLE_MORE_ACTIONS}
        formatHeader={(key) => key.toUpperCase()}
        striped
        bordered
      />
    </Card>
  );
};
