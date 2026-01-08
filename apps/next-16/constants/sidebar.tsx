import Link from "next/link";

import { Home, Users, Swords } from "@uiid/icons";
import type { ListProps } from "@uiid/lists";

import {
  PLAYERS_PATH,
  EVENT_CALENDAR_PATH,
  DISCORD_INVITE_URL,
  FIND_MATCH_PATH,
  ROOT_PATH,
  LEADERBOARD_PATH,
} from "@/constants/urls";

export const SIDEBAR_LINKS: ListProps["items"] = [
  {
    label: "Dashboard",
    value: "dashboard",
    icon: Home,
    render: <Link href={ROOT_PATH} />,
  },
  {
    category: "Community",
    collapsible: true,
    icon: Users,
    items: [
      {
        label: "Player directory",
        value: "players",
        render: <Link href={PLAYERS_PATH} />,
      },
      {
        label: "Event calendar",
        value: "event-calendar",
        render: <Link href={EVENT_CALENDAR_PATH} />,
      },
      {
        label: "Join the Discord",
        value: "join-the-discord",
        render: <Link href={DISCORD_INVITE_URL} target="_blank" />,
      },
    ],
  },
  {
    category: "Competition",
    collapsible: true,
    icon: Swords,
    items: [
      {
        label: "Leaderboards",
        value: "leaderboards",
        render: <Link href={LEADERBOARD_PATH} />,
      },
      {
        label: "Find a match",
        value: "find-a-match",
        render: <Link href={FIND_MATCH_PATH}>Find a match</Link>,
      },
      { label: "Create a match", value: "create-a-match" },
      { label: "Recent matches", value: "recent-matches" },
    ],
  },
];
