"use client";

import Link from "next/link";

import { SiStorybook, SiGithub } from "@icons-pack/react-simple-icons";

import { Button } from "@uiid/buttons";
import { Blocks } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { toSlug } from "@/constants/urls";
import { CREATE_URL, GITHUB_URL, STORYBOOK_URL } from "@/constants";

interface ComponentDetailsHeaderProps {
  name: string;
  description?: string;
  packageName: string;
  category: string;
}

export function ComponentDetailsHeader({
  name,
  description,
  packageName,
  category,
}: ComponentDetailsHeaderProps) {
  const componentSlug = toSlug(name);
  const packageFolder = packageName.replace("@uiid/", "");

  // Build component-specific URLs
  const builderUrl = `${CREATE_URL}?component=${name}`;
  const storybookUrl = `${STORYBOOK_URL}/?path=/story/${category}-${componentSlug}--default`;
  const githubUrl = `${GITHUB_URL}/tree/main/packages/${packageFolder}/src/${componentSlug}`;

  return (
    <Group ax="space-between" ay="start" gap={4} fullwidth>
      <Stack gap={6} ax="stretch">
        <Text render={<h1 />} size={6} weight="bold">
          {name}
        </Text>
        {description && (
          <Text shade="muted" size={1}>
            {description}
          </Text>
        )}
      </Stack>

      <Group gap={2} ay="center">
        <Button
          size="small"
          nativeButton={false}
          render={<Link href={builderUrl} target="_blank" />}
        >
          <Blocks />
          Open in Builder
        </Button>
        <Button
          tooltip="Open in Storybook"
          size="small"
          nativeButton={false}
          square
          render={<Link href={storybookUrl} target="_blank" />}
        >
          <SiStorybook />
        </Button>
        <Button
          tooltip="Open in GitHub"
          size="small"
          nativeButton={false}
          square
          render={<Link href={githubUrl} target="_blank" />}
        >
          <SiGithub />
        </Button>
      </Group>
    </Group>
  );
}
ComponentDetailsHeader.displayName = "ComponentDetailsHeader";
