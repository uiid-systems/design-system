import { Alert } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";

import { Headline } from "../components/typography";
import { BasicCard } from "../components/cards";
import { DemoTable } from "../components/tables";

export default function Home() {
  return (
    <>
      <Alert
        variant="inverted"
        title="Will this project ever be finished? Tune in next year to find out!"
        size="sm"
        className="m-3 mb-0"
      />
      <Stack render={<main />} p={8} gap={8} className="max-w-7xl">
        <Headline />

        <Group gap={4} evenly>
          <BasicCard />
          <BasicCard />
        </Group>
        <DemoTable />
      </Stack>
    </>
  );
}
