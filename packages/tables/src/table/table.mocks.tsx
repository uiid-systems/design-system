import { Swords, Star } from "@uiid/icons";

import type { TableProps } from "./table.types";

export type TableMockData = {
  balance: string;
  email: string;
  id: string;
  location: string;
  name: string;
  status: string;
};

export const TABLE_MOCK_DATA: TableMockData[] = [
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

export const TABLE_MOCK_ACTIONS: TableProps["actions"] = [
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
];

export const TABLE_MOCK_MORE_ACTIONS: TableProps["moreActions"] = {
  tooltip: "Settings",
  items: [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ],
};
