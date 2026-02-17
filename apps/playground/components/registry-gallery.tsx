"use client";

import { useRouter } from "next/navigation";

import { Card } from "@uiid/cards";
import { Badge } from "@uiid/indicators";
import { LoadingSpinner } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import type { BlockFile } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";
import { useRegistryBlocks } from "@/lib/use-registry-blocks";

import { BlockThumbnail } from "./block-thumbnail";

import styles from "./registry-gallery.module.css";

/** Layout primitives excluded from the component-type breakdown */
const LAYOUT_TYPES = new Set([
  "Stack",
  "Group",
  "Box",
  "Layer",
  "Separator",
  "Form",
]);

export const RegistryGallery = () => {
  const router = useRouter();
  const { blocks, isLoading } = useRegistryBlocks();
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);

  const handleLoad = (block: BlockFile) => {
    setTree(block.tree);
    setActiveRegistryBlock(block);
    router.push("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent, block: BlockFile) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLoad(block);
    }
  };

  if (isLoading) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth>
        <LoadingSpinner size={20} />
      </Stack>
    );
  }

  if (blocks.length === 0) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth gap={4}>
        <div className={styles.emptyGrid}>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className={styles.emptyCell} />
          ))}
        </div>
        <Text size={2} weight="bold" shade="muted">
          No blocks yet
        </Text>
        <Text shade="muted">
          Use the AI assistant to generate blocks, or create one manually.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack
      ax="center"
      fullwidth
      fullheight
      p={8}
      gap={8}
      className={styles.page}
    >
      <Stack gap={4} fullwidth maxw={1152}>
        <Group gap={3} ay="baseline">
          <Text size={4} weight="bold">
            Registry
          </Text>
          <Text size={0} shade="muted" className={styles.count}>
            {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
          </Text>
        </Group>
        <Text shade="muted">
          Browse and load component blocks from the registry.
        </Text>
      </Stack>

      <div className={styles.grid}>
        {blocks.map((block) => {
          const cc = safeCount(block);
          const types = getComponentTypes(block);

          return (
            <Card
              key={block.slug}
              onClick={() => handleLoad(block)}
              onKeyDown={(e) => handleKeyDown(e, block)}
              tabIndex={0}
              className={styles.card}
              trimmed
              ax="stretch"
            >
              <div className={styles.preview}>
                <BlockThumbnail spec={block.tree} />
              </div>

              <Stack
                gap={4}
                px={8}
                pb={8}
                pt={4}
                fullheight
                style={{ textAlign: "left" }}
              >
                <Text size={1} weight="bold">
                  {block.name}
                </Text>

                {block.description && (
                  <Text size={-1} shade="muted">
                    {block.description}
                  </Text>
                )}

                {types.length > 0 && (
                  <Group gap={1} pt={4} mt="auto" className={styles.types}>
                    {types.slice(0, 4).map((type) => (
                      <span key={type} className={styles.typePill}>
                        {type}
                      </span>
                    ))}
                    {types.length > 4 && (
                      <span className={styles.typePill}>
                        +{types.length - 4}
                      </span>
                    )}
                  </Group>
                )}

                {block.tags.length > 0 && (
                  <Group gap={1}>
                    {block.tags.map((tag) => (
                      <Badge key={tag} size="small">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                )}

                <Group ay="center" ax="space-between" fullwidth pt={4} bt={1}>
                  {cc && (
                    <Text size={-1} shade="muted">
                      {cc.total} elements · {cc.unique} types
                    </Text>
                  )}
                  <Text size={-1} shade="muted">
                    {formatDate(block.updatedAt)}
                  </Text>
                </Group>
              </Stack>
            </Card>
          );
        })}
      </div>
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

function getComponentTypes(block: BlockFile): string[] {
  try {
    const { counts } = countComponents(block.tree);
    return Object.keys(counts)
      .filter((type) => !LAYOUT_TYPES.has(type))
      .sort((a, b) => counts[b] - counts[a]);
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
