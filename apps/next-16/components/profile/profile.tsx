import Link from "next/link";

import { Card } from "@uiid/cards";
import { CircleStarIcon, SwordsIcon, TrophyIcon } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { PlayerTable } from "@/components/tables";
import { MATCHES_PATH } from "@/constants/urls";

import { GRID_GAP, PROFILE_INFO_CARD_MINWIDTH } from "./profile.constants";

import { ProfileInfoCard } from "./profile-info-card";

import { ProfileStat } from "./subcomponents";

import { MOCK_PROFILE_DETAILS } from "./profile.mocks";

export const Profile = () => {
  return (
    <Group gap={GRID_GAP} fullwidth ay="start">
      <Stack
        ax="stretch"
        gap={GRID_GAP}
        style={{ minWidth: PROFILE_INFO_CARD_MINWIDTH }}
      >
        <ProfileInfoCard
          name="Adam Fratino"
          description="Software Engineer"
          initials="AF"
          details={MOCK_PROFILE_DETAILS}
        />
      </Stack>

      <Stack ax="stretch" gap={GRID_GAP} fullwidth>
        <Group gap={GRID_GAP} fullwidth evenly>
          <ProfileStat title="Matches played" value={21} icon={SwordsIcon} />
          <ProfileStat title="Rank" value={1613} icon={CircleStarIcon} />
        </Group>

        <Stack gap={4} fullwidth>
          <Text size={1} weight="bold">
            Last 3 matches
          </Text>

          <Group gap={GRID_GAP} fullwidth evenly>
            <Card
              IconProps={{ icon: TrophyIcon, className: "text-yellow-500" }}
              title={
                <>
                  <Text shade="accent" size={0}>
                    vs.
                  </Text>{" "}
                  John Doe
                </>
              }
            ></Card>
          </Group>
        </Stack>

        <Card
          gap={4}
          ghost
          title="Recent matches"
          action={<Link href={MATCHES_PATH}>View all matches</Link>}
        >
          <PlayerTable />
        </Card>
      </Stack>
    </Group>
  );
};
Profile.displayName = "Profile";
