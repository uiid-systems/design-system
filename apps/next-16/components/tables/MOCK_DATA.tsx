import { formatDate, DateCalendar } from "@uiid/calendars";
import { Swords, Star, Heart, Calendar } from "@uiid/icons";
import type { MenuProps } from "@uiid/interactive";
import { Modal, Sheet } from "@uiid/overlays";
import type { TableProps } from "@uiid/tables";

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

export const TABLE_MOCK_COLUMNS: TableProps["columns"] = [
  "Name",
  "Rank",
  "Played",
  "Won",
  "Last Played",
];

export const TABLE_MOCK_DATA: TableProps["items"] = [
  {
    name: (
      <Sheet
        trigger="John Doe"
        side="right"
        TriggerProps={{
          className: "cursor-pointer hover:underline",
        }}
      >
        <p>John Doe</p>
      </Sheet>
    ),
    rank: 1,
    played: 12,
    won: 6,
    lastPlayed: formatDate(new Date("2025-01-01"), "PPPP"),
  },
  {
    name: "Jane Doe",
    rank: 2,
    played: 5,
    won: 3,
    lastPlayed: formatDate(new Date("2025-01-01"), "PPPP"),
  },
  {
    name: "John Smith",
    rank: 3,
    played: 8,
    won: 8,
    lastPlayed: formatDate(new Date("2025-01-01"), "PPPP"),
  },
  {
    name: "Jane Smith",
    rank: 4,
    played: 10,
    won: 9,
    lastPlayed: formatDate(new Date("2025-01-01"), "PPPP"),
  },
];

export const TABLE_MOCK_ACTIONS: TableActions["primary"] = [
  {
    icon: <Calendar />,
    tooltip: "See schedule",
    wrapper: (button) => (
      <Modal trigger={button} title="Schedule">
        <DateCalendar />
      </Modal>
    ),
  },
  {
    icon: <Swords />,
    tooltip: "Challenge",
    wrapper: (button) => (
      <Modal trigger={button} title="Challenge">
        <p>Challenge content goes here</p>
      </Modal>
    ),
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
    wrapper: (button) => (
      <Modal trigger={button} title="Friend">
        <p>Friend content goes here</p>
      </Modal>
    ),
  },
];

export const TABLE_MOCK_MORE_ACTIONS: TableActions["secondary"] = {
  tooltip: "More actions",
  items: [
    { label: "View profile", value: "view-profile" },
    { label: "Delete", value: "delete" },
  ],
};
