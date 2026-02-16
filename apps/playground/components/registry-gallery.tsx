"use client";

import { Badge } from "@uiid/indicators";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import type { BlockFile } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";
import { useRegistryBlocks } from "@/lib/use-registry-blocks";

import { BlockThumbnail } from "./block-thumbnail";

import styles from "./registry-gallery.module.css";

export const RegistryGallery = () => {
  const { blocks, isLoading } = useRegistryBlocks();
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);

  const handleLoad = (block: BlockFile) => {
    setTree(block.tree);
    setActiveRegistryBlock(block);
  };

  if (isLoading) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth>
        <Text shade="muted">Loading blocks...</Text>
      </Stack>
    );
  }

  if (blocks.length === 0) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth gap={2}>
        <Text size={2} weight="bold" shade="muted">
          No blocks in registry
        </Text>
        <Text shade="muted">
          Export a saved block or use the AI assistant to create one.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack ax="center" fullwidth fullheight p={8} style={{ overflowY: "auto" }}>
      <Stack gap={4} ax="center" style={{ maxWidth: "72rem", width: "100%" }}>
        <Text size={3} weight="bold">
          Block Registry
        </Text>
        <Text shade="muted" mb={4}>
          Browse and load blocks from the registry.
        </Text>
        <div className={styles.grid}>
          {blocks.map((block) => {
            const cc = safeCount(block);
            return (
              <button
                key={block.slug}
                className={styles.card}
                onClick={() => handleLoad(block)}
                type="button"
              >
                <BlockThumbnail spec={block.tree} />
                <Stack gap={2} p={3} ax="stretch">
                  <Text size={1} weight="bold">
                    {block.name}
                  </Text>
                  {block.description && (
                    <Text size={-1} shade="muted" style={{ lineClamp: 2 }}>
                      {block.description}
                    </Text>
                  )}
                  <Group gap={2} ay="center" style={{ flexWrap: "wrap" }}>
                    {cc && (
                      <Text size={-1} shade="muted">
                        {cc.total} {cc.total === 1 ? "component" : "components"}
                      </Text>
                    )}
                    {block.tags.map((tag) => (
                      <Badge key={tag} size="small">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </button>
            );
          })}
        </div>
      </Stack>
    </Stack>
  );
};
RegistryGallery.displayName = "RegistryGallery";

function safeCount(block: BlockFile) {
  try {
    return countComponents(block.tree);
  } catch {
    return null;
  }
}
