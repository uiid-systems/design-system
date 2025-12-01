import { Group, Stack } from "@uiid/layout";

import { Headline } from "../components/typography";
import { CardWithHeaderAction, BasicCard } from "../components/cards";
import { Inputs } from "../components/forms";

export default function Home() {
  return (
    <Stack render={<main />} p={8} gap={8} className="max-w-5xl">
      <Headline />

      <Group gap={4} evenly>
        <BasicCard />
        <CardWithHeaderAction />
      </Group>

      <Inputs />
    </Stack>
  );
}
