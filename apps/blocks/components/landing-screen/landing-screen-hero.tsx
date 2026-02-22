"use client";

import Link from "next/link";

import { Button } from "@uiid/buttons";
import { ArrowRightIcon } from "@uiid/icons";
import { Badge } from "@uiid/indicators";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const LandingScreenHero = () => {
  return (
    <Stack gap={8} ax="center">
      <Badge hideIndicator tone="info">
        Open-source design system
      </Badge>

      <Stack gap={4} ax="center">
        <Text size={8} weight="bold" balance style={{ textAlign: "center" }}>
          Production-ready UI components, assembled by AI
        </Text>
        <Text size={2} shade="muted" balance style={{ textAlign: "center" }}>
          UIID is a component library with full accessibility, design tokens,
          and theming — paired with an AI composer that lets you describe
          interfaces in plain language and get working layouts instantly.
        </Text>
      </Stack>

      <Button render={<Link href="/registry" />} shape="pill">
        Browse the registry
        <ArrowRightIcon size={16} />
      </Button>
    </Stack>
  );
};
LandingScreenHero.displayName = "LandingScreenHero";
