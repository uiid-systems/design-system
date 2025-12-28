import { Badge } from "@uiid/indicators";
import { formatDate, DatePicker } from "@uiid/calendars";
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
  "Rank",
  "Name",
  "Played",
  "Won",
  "Last Played",
];

export const FIND_A_MATCH_MOCK_COLUMNS: TableProps["columns"] = [
  "Date",
  "Player",
  "Duration",
  "Stakes",
  "Accepting",
  "Stipulations",
];

export const FIND_A_MATCH_MOCK_DATA: TableProps["items"] = [
  {
    date: "2025-01-01",
    player: "John Doe",
    duration: (
      <Badge variant="negative" hideIndicator>
        16 frames
      </Badge>
    ),
    stakes: <Badge variant="positive">Low</Badge>,
    accepting: (
      <Badge variant="positive" hideIndicator>
        All
      </Badge>
    ),
    stipulations: ["Switch at half", "Adam's rules"],
  },
  {
    date: "2025-01-01",
    player: "Jane Doe",
    duration: (
      <Badge variant="warning" hideIndicator>
        8 frames
      </Badge>
    ),
    stakes: <Badge variant="warning">Medium</Badge>,
    accepting: (
      <Badge variant="negative" hideIndicator>
        1700 & up
      </Badge>
    ),
    stipulations: ["Switch at half", "Adam's rules"],
  },
];

export const TABLE_MOCK_DATA: TableProps["items"] = [
  {
    rank: <Badge variant="positive">1</Badge>,
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
    played: 12,
    won: 6,
    lastPlayed: formatDate(new Date("2025-03-01"), "EEE',' MMM d"),
  },
  {
    rank: <Badge variant="warning">2</Badge>,
    name: "Jane Doe",
    played: 5,
    won: 3,
    lastPlayed: formatDate(new Date("2025-04-01"), "EEE',' MMM d"),
  },
  {
    rank: <Badge variant="warning">3</Badge>,
    name: "John Smith",
    played: 8,
    won: 8,
    lastPlayed: formatDate(new Date("2025-01-03"), "EEE',' MMM d"),
  },
  {
    rank: <Badge variant="negative">4</Badge>,
    name: "Jane Smith",
    played: 10,
    won: 9,
    lastPlayed: formatDate(new Date("2025-09-07"), "EEE',' MMM d"),
  },
];

export const TABLE_MOCK_ACTIONS: TableActions["primary"] = [
  {
    icon: Calendar,
    tooltip: "See schedule",
    wrapper: (button) => (
      <Modal trigger={button}>
        <p>Schedule content goes here</p>
        <DatePicker headless />
      </Modal>
    ),
  },
  {
    icon: Swords,
    tooltip: "Challenge",
    wrapper: (button) => (
      <Modal trigger={button}>
        <p>Challenge content goes here</p>
      </Modal>
    ),
  },
  {
    icon: Star,
    tooltip: "Favorite",
    onClick: () => console.log("Favorite"),
  },
  {
    icon: Heart,
    tooltip: "Friend",
    onClick: () => console.log("Friend"),
    wrapper: (button) => (
      <Modal trigger={button}>
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
