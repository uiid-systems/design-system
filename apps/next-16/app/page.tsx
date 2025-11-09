import { Stack } from "@uiid/layout";

import { Text } from "../components/typography";
import { Buttons, ToggleButtons } from "../components/buttons";
import { CardWithHeaderAction, BasicCard } from "../components/cards";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Stack gap={16} fullwidth>
          <Text />

          <Stack gap={2}>
            <Buttons />
            <ToggleButtons />
          </Stack>

          <Stack gap={2}>
            <BasicCard />
            <CardWithHeaderAction />
          </Stack>
        </Stack>
      </main>
    </div>
  );
}
