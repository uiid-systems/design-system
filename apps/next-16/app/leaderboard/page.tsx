import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export default function LeaderboardPage() {
  return (
    <Stack gap={4} fullwidth>
      <Text level={4} bold>
        Leaderboard
      </Text>
      <Group gap={4} evenly>
        <Card title="Overall">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
        <Card title="Overall">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
        <Card title="Overall">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </Card>
      </Group>
    </Stack>
  );
}
