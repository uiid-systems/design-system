import { CircleStarIcon, SwordsIcon } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { GRID_GAP } from "./profile.constants";
import { MOCK_PROFILE_DETAILS, MOCK_MATCHES } from "./profile.mocks";

import { ProfileInfoCard } from "./profile-info-card";
import { RecentMatchCard } from "./recent-match-card";
import { ProfileSidebar, ProfileStat } from "./subcomponents";

export const Profile = () => {
  return (
    <Group gap={GRID_GAP} fullwidth ay="start">
      <ProfileSidebar>
        <ProfileInfoCard
          name="Adam Fratino"
          description="Software Engineer"
          initials="AF"
          details={MOCK_PROFILE_DETAILS}
        />
      </ProfileSidebar>

      <Stack ax="stretch" gap={GRID_GAP} fullwidth>
        <Group gap={4} fullwidth evenly>
          <ProfileStat title="Matches played" value={21} icon={SwordsIcon} />
          <ProfileStat title="Rank" value={1613} icon={CircleStarIcon} />
        </Group>

        <Stack gap={4} fullwidth>
          <Text size={1} weight="bold">
            Last 3 matches
          </Text>

          <Group gap={4} fullwidth evenly>
            {MOCK_MATCHES.map((match) => (
              <RecentMatchCard
                key={`${match.date}-${match.opponent}-${match.heroScore}-${match.villainScore}`}
                {...match}
              />
            ))}
          </Group>
        </Stack>

        {/* <Card
          gap={4}
          ghost
          title="Recent matches"
          action={<Link href={MATCHES_PATH}>View all matches</Link>}
        >
          <PlayerTable />
        </Card> */}
      </Stack>
    </Group>
  );
};
Profile.displayName = "Profile";
