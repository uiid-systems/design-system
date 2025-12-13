import { Group } from "@uiid/layout";

import { Headline } from "@/components/typography";
import { BasicCard } from "@/components/cards";

export default function Home() {
  return (
    <>
      <Headline />

      <Group gap={4} evenly>
        <BasicCard />
        <BasicCard />
      </Group>
    </>
  );
}
