import { Group, Stack } from "@uiid/layout";

import { Headline } from "@/components/typography";
import { BasicCard } from "@/components/cards";
import { FindAMatch } from "@/components/tables";
import { PageContainer } from "@/components/global";

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
