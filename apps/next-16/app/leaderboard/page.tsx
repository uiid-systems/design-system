import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export default function LeaderboardPage() {
  return (
    <Stack gap={4} fullwidth>
      <Text size={4} bold>
        Leaderboard
      </Text>
      <Group gap={4} evenly>
        <Card title="Player of the month" size="lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
        <Card title="Player of the year" size="lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
        <Card title="Overall" size="lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
      </Group>
    </Stack>
  );
}
