"use client";

import Link from "next/link";

import { Button } from "@uiid/buttons";
import { DateRangePicker } from "@uiid/calendars";
import { Card } from "@uiid/cards";
import { SelectMultiple, type SelectMultipleProps } from "@uiid/forms";
import { ChevronRight } from "@uiid/icons";
import { Alert } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { PlayerTable } from "@/components/tables";
import { PLAYERS_PATH } from "@/constants/urls";

const MATCH_TYPES: SelectMultipleProps["items"] = [
  { label: "Friendly", value: "friendly" },
  { label: "Competitive", value: "competitive" },
  { label: "Ranked", value: "ranked" },
];

export default function Home() {
  return (
    <>
      <Alert
        tone="warning"
        title="Will this project ever be finished? Tune in next year to find out!"
      />

      <Group gap={4} ay="start" fullwidth>
        <Stack gap={4} className="flex-1">
          <Group gap={2} ay="center" ax="space-between" fullwidth>
            <Text size={2} weight="bold">
              Top players
            </Text>
            <Button
              size="small"
              render={<Link href={PLAYERS_PATH} />}
              nativeButton={false}
            >
              View all players
              <ChevronRight />
            </Button>
          </Group>
          <PlayerTable />
        </Stack>

        <Card
          title="Ready to play a match?"
          description="Pick a date or range of dates you're available, choose the type of match(es) you're looking to play, and someone from the community will respond."
          ax="center"
          style={{ maxWidth: "22rem" }}
        >
          <Stack
            gap={8}
            py={4}
            mt={4}
            ax="stretch"
            fullwidth
            className="border-t border-t-(--globals-border-color)"
          >
            <DateRangePicker showOutsideDays className="mx-auto" />
            <SelectMultiple
              label="What type of match?"
              description="Choose all that apply."
              placeholder="Select match type(s)"
              items={MATCH_TYPES}
            />

            <Stack gap={2} fullwidth ax="stretch">
              <Button>Set availability</Button>
              <Button ghost>Reset</Button>
            </Stack>
          </Stack>
        </Card>
      </Group>
    </>
  );
}
