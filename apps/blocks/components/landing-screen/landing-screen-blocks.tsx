"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { ArrowRightIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { BlockFile } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";
import { useRegistryBlocks } from "@/lib/use-registry-blocks";
import { BlockThumbnail } from "../block-thumbnail";

const MAX_FEATURED = 3;

export const LandingScreenBlocks = () => {
  const router = useRouter();
  const { blocks, isLoading } = useRegistryBlocks();
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);

  const handleLoad = (block: BlockFile) => {
    setTree(block.tree);
    setActiveRegistryBlock(block);
    router.push(`/registry/${block.slug}`);
  };

  if (isLoading || blocks.length === 0) return null;

  const featured = blocks.slice(0, MAX_FEATURED);

  return (
    <Stack gap={8} ax="center" fullwidth>
      <Stack gap={3} ax="center">
        <Text size={4} weight="bold" style={{ textAlign: "center" }}>
          Start from a block
        </Text>
        <Text shade="muted" style={{ textAlign: "center" }} balance>
          Pre-built component layouts you can load, customize, and iterate on
          with AI — or use as-is.
        </Text>
      </Stack>

      <Group gap={4} fullwidth evenly>
        {featured.map((block) => (
          <Card
            key={block.slug}
            onClick={() => handleLoad(block)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLoad(block);
              }
            }}
            trimmed
            ax="stretch"
            style={{ cursor: "pointer", flex: 1 }}
          >
            <Stack
              p={4}
              bb={1}
              style={{
                backgroundColor: "var(--shade-background)",
                backgroundImage:
                  "radial-gradient(circle, var(--shade-accent) 0.75px, transparent 0.75px)",
                backgroundSize: "20px 20px",
              }}
            >
              <BlockThumbnail spec={block.tree} />
            </Stack>
            <Stack gap={2} p={4}>
              <Text size={0} weight="bold">
                {block.name}
              </Text>
              {block.description && (
                <Text size={-1} shade="muted">
                  {block.description}
                </Text>
              )}
            </Stack>
          </Card>
        ))}
      </Group>

      {blocks.length > MAX_FEATURED && (
        <Button render={<Link href="/registry" />} variant="ghost" shape="pill">
          Browse all {blocks.length} blocks
          <ArrowRightIcon size={16} />
        </Button>
      )}
    </Stack>
  );
};
LandingScreenBlocks.displayName = "LandingScreenBlocks";
