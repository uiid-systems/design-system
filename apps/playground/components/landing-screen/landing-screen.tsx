import { Stack, Group } from "@uiid/layout";

import { LandingScreenChat } from "./landing-screen-chat";
import { LandingScreenBlocks } from "./landing-screen-blocks";

export const LandingScreen = () => {
  return (
    <Stack ax="center" ay="center" fullwidth fullheight>
      <Group evenly fullwidth fullheight>
        <LandingScreenChat />
        <LandingScreenBlocks />
      </Group>
    </Stack>
  );
};
LandingScreen.displayName = "LandingScreen";
