import { Calendar, Swords, Star, Heart } from "@uiid/icons";
import type { TableProps } from "@uiid/tables";
import type { MenuProps } from "@uiid/interactive";

type TableActions = NonNullable<TableProps["actions"]>;

export const TABLE_MOCK_FILTERS: MenuProps["items"] = [
  {
    label: "All",
    value: "all",
    items: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const TABLE_MOCK_DATA: TableProps["items"] = [
  {
    name: "John Doe",
    rank: 1,
    played: 12,
    won: 6,
    lastPlayed: new Date("2025-01-01").toISOString().split("T")[0],
  },
  {
    name: "Jane Doe",
    rank: 2,
    played: 5,
    won: 3,
    lastPlayed: new Date("2025-01-01").toISOString().split("T")[0],
  },
  {
    name: "John Smith",
    rank: 3,
    played: 8,
    won: 8,
    lastPlayed: new Date("2025-01-01").toISOString().split("T")[0],
  },
  {
    name: "Jane Smith",
    rank: 4,
    played: 10,
    won: 9,
    lastPlayed: new Date("2025-01-01").toISOString().split("T")[0],
  },
];

export const TABLE_MOCK_ACTIONS: TableActions["primary"] = [
  {
    icon: <Calendar />,
    tooltip: "See schedule",
    onClick: () => console.log("See schedule"),
  },
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
    tooltip: "Friend",
    onClick: () => console.log("Friend"),
  },
];

export const TABLE_MOCK_MORE_ACTIONS: TableActions["secondary"] = {
  tooltip: "More actions",
  items: [
    { label: "View profile", value: "view-profile" },
    { label: "Delete", value: "delete" },
  ],
};
