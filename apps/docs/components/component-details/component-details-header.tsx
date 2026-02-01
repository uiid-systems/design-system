"use client";

import Link from "next/link";

import { SiStorybook, SiGithub } from "@icons-pack/react-simple-icons";

import type { PreviewConfig } from "@uiid/registry";
import { Button } from "@uiid/buttons";
import { Blocks } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { toSlug } from "@/constants/urls";
import { CREATE_URL, GITHUB_URL, STORYBOOK_URL } from "@/constants";
import { usePreviewContext } from "@/components/preview-context";

function encodeTree(tree: PreviewConfig["tree"]): string {
  return btoa(encodeURIComponent(JSON.stringify(tree)));
}

interface ComponentDetailsHeaderProps {
  name: string;
  description?: string;
  packageName: string;
  category: string;
  previews?: PreviewConfig[];
}

export function ComponentDetailsHeader({
  name,
  description,
  packageName,
  category,
  previews,
}: ComponentDetailsHeaderProps) {
  const previewContext = usePreviewContext();
  const activeIndex = previewContext?.activeIndex ?? 0;

  const componentSlug = toSlug(name);
  const packageFolder = packageName.replace("@uiid/", "");

  // Build component-specific URLs
  const activeTree = previews?.[activeIndex]?.tree;
  const builderUrl = activeTree
    ? `${CREATE_URL}/#${encodeTree(activeTree)}`
    : `${CREATE_URL}?component=${name}`;
  const storybookUrl = `${STORYBOOK_URL}/?path=/story/${category}-${componentSlug}--default`;
  const githubUrl = `${GITHUB_URL}/tree/main/packages/${packageFolder}/src/${componentSlug}`;

  return (
    <Group ax="space-between" gap={16} pt={4} pb={8} bb={1} fullwidth>
      <Stack gap={8} ax="stretch">
        <Text render={<h1 />} size={6} weight="bold">
          {name}
        </Text>
        {description && (
          <Text shade="muted" size={1} balance>
            {description}
          </Text>
        )}
      </Stack>

      <Stack gap={2} ax="end">
        <Button
          ghost
          size="small"
          nativeButton={false}
          render={<Link href={builderUrl} target="_blank" />}
        >
          Open&nbsp;in&nbsp;Playground
          <Blocks />
        </Button>
        <Button
          ghost
          size="small"
          nativeButton={false}
          render={<Link href={storybookUrl} target="_blank" />}
        >
          Open in Storybook
          <SiStorybook />
        </Button>
        <Button
          ghost
          size="small"
          nativeButton={false}
          render={<Link href={githubUrl} target="_blank" />}
        >
          Open in GitHub
          <SiGithub />
        </Button>
      </Stack>
    </Group>
  );
}
ComponentDetailsHeader.displayName = "ComponentDetailsHeader";
