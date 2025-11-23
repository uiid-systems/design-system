import { Stack } from "@uiid/layout";

import { Headline } from "../components/typography";
import { Buttons, ToggleButtons } from "../components/buttons";
import { CardWithHeaderAction, BasicCard } from "../components/cards";
import { Inputs } from "../components/forms";

export default function Home() {
  return (
    <Stack render={<main />} p={8} gap={8} className="max-w-2xl">
      <Headline />
      {/* <Text /> */}
      <Stack gap={2}>
        <Buttons />
        <ToggleButtons />
      </Stack>

      <Stack gap={2}>
        <BasicCard />
        <CardWithHeaderAction />
      </Stack>

      <Inputs />
    </Stack>
  );
}
