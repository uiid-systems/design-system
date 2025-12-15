import Link from "next/link";

import { Users, Swords } from "@uiid/icons";
import type { ListProps } from "@uiid/layout";

import {
  PLAYERS_PATH,
  EVENT_CALENDAR_PATH,
  DISCORD_INVITE_URL,
  FIND_MATCH_PATH,
} from "@/constants/urls";

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
      {
        label: "Player directory",
        value: "players",
        render: <Link href={PLAYERS_PATH}>Player directory</Link>,
      },
      {
        label: "Event calendar",
        value: "event-calendar",
        render: <Link href={EVENT_CALENDAR_PATH}>Event calendar</Link>,
      },
      {
        label: "Join the Discord",
        value: "join-the-discord",
        render: (
          <Link href={DISCORD_INVITE_URL} target="_blank">
            Player directory
          </Link>
        ),
      },
    ],
  },
  {
    category: "Competition",
    collapsible: true,
    icon: Swords,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
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
