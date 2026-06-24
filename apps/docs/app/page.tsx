"use client";

import { Badge, Stack, Table } from "@uiid/design-system";
import type {
  TableActionsProps,
  TableCellDropdownProps,
} from "@uiid/design-system";
import { Star, Swords } from "@uiid/icons";

type TableMockData = {
  name: string;
  email: string;
  location: string;
  balance: string;
  status: React.ReactNode;
};

const TABLE_MOCK_DATA: TableMockData[] = [
  {
    name: "Alex Thompson",
    email: "alex.t@company.com",
    location: "San Francisco, US",
    balance: "$1,250.00",
    status: (
      <Badge size="small" color="green">
        Active
      </Badge>
    ),
  },
  {
    name: "Sarah Chen",
    email: "sarah.c@company.com",
    location: "Singapore",
    balance: "$600.00",
    status: (
      <Badge size="small" color="green">
        Active
      </Badge>
    ),
  },
  {
    name: "James Wilson",
    email: "j.wilson@company.com",
    location: "London, UK",
    balance: "$650.00",
    status: (
      <Badge size="small" color="neutral">
        Inactive
      </Badge>
    ),
  },
  {
    name: "Maria Garcia",
    email: "m.garcia@company.com",
    location: "Madrid, Spain",
    balance: "$0.00",
    status: (
      <Badge size="small" color="green">
        Active
      </Badge>
    ),
  },
  {
    name: "David Kim",
    email: "d.kim@company.com",
    location: "Seoul, KR",
    balance: "-$1,000.00",
    status: (
      <Badge size="small" color="green">
        Active
      </Badge>
    ),
  },
];

const TABLE_MOCK_ACTIONS: TableActionsProps<TableMockData>[] = [
  {
    icon: Swords,
    tooltip: "Challenge",
    onClick: (item) => console.log("Challenge", item.name),
  },
  {
    icon: Star,
    tooltip: "Favorite",
    onClick: (item) => console.log("Favorite", item.name),
  },
];

const TABLE_MOCK_MORE_ACTIONS: TableCellDropdownProps = {
  tooltip: "Settings",
  items: [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ],
};

export default function HomePage() {
  return (
    <Stack data-slot="home-page" gap={4} fullwidth>
      <Table<TableMockData>
        items={TABLE_MOCK_DATA}
        actions={{
          primary: TABLE_MOCK_ACTIONS,
          secondary: TABLE_MOCK_MORE_ACTIONS,
        }}
        footer={`${TABLE_MOCK_DATA.length} users`}
        highlightOnHover
        selectable
        bordered
        striped
      />
    </Stack>
  );
}
