import { Users, Swords } from "@uiid/icons";
import type { ListProps } from "@uiid/layout";

export const APP_LINKS: ListProps["items"] = [
  {
    label: "TODO: Fix top-level item",
    value: "top-level-item",
    icon: Users,
  },
  {
    category: "Community",
    collapsible: true,
    icon: Users,
    items: [
      { label: "Player directory", value: "players" },
      { label: "Join the Discord", value: "join-the-discord" },
    ],
  },
  {
    category: "Competition",
    collapsible: true,
    icon: Swords,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Find a match", value: "find-a-match" },
      { label: "Create a match", value: "create-a-match" },
      { label: "Recent matches", value: "recent-matches" },
    ],
  },
];
