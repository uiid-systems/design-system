import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { BasicCard } from "@/components/cards";

export default function Home() {
  return (
    <>
      <Text size={4} bold>
        Welcome to the UIID Next 16 example app
      </Text>
      <Group gap={4} evenly>
        <BasicCard />
        <BasicCard />
      </Group>
    </>
  );
}
