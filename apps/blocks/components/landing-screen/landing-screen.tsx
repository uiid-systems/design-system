"use client";

import { Stack, Separator } from "@uiid/layout";

import { LandingScreenHero } from "./landing-screen-hero";
import { LandingScreenBlocks } from "./landing-screen-blocks";
import { LandingScreenStats } from "./landing-screen-stats";

export const LandingScreen = () => {
  return (
    <Stack
      data-slot="landing-screen"
      ax="center"
      fullwidth
      fullheight
      style={{ overflowY: "auto" }}
    >
      <Stack ax="center" fullwidth maxw={960} gap={16} py={16} px={6}>
        <LandingScreenHero />
        <Separator />
        <LandingScreenBlocks />
        <Separator />
        <LandingScreenStats />
      </Stack>
    </Stack>
  );
};
LandingScreen.displayName = "LandingScreen";
