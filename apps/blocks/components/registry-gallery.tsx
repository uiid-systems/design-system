"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card } from "@uiid/cards";
import { Badge } from "@uiid/indicators";
import { LoadingSpinner, TriangleAlertIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import type { BlockFile, BlockFileWithSource } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";
import { useRegistryBlocks } from "@/lib/use-registry-blocks";
import type { SourceMeta } from "@/lib/use-registry-blocks";

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
  const { blocks, sourceErrors, sources, isLoading } = useRegistryBlocks();
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const filteredBlocks = activeSource
    ? blocks.filter((b) => hasSource(b) && b._source === activeSource)
    : blocks;

  const handleLoad = (block: BlockFile) => {
    setTree(block.tree);
    setActiveRegistryBlock(block);
    router.push(`/registry/${block.slug}`);
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
          Use the AI assistant to generate blocks, or{" "}
          <Link href="/settings" className={styles.settingsLink}>
            configure a block source
          </Link>{" "}
          to get started.
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
            {filteredBlocks.length} {filteredBlocks.length === 1 ? "block" : "blocks"}
            {activeSource && ` in ${activeSource}`}
          </Text>
        </Group>
        <Text shade="muted">
          Browse and load component blocks from the registry.
        </Text>
      </Stack>

      {sources.length > 1 && (
        <SourceFilter
          sources={sources}
          blocks={blocks}
          activeSource={activeSource}
          onSelect={setActiveSource}
        />
      )}

      {sourceErrors.length > 0 && (
        <Stack gap={2} fullwidth maxw={1152}>
          {sourceErrors.map((err) => (
            <Group
              key={err.source}
              gap={2}
              ay="center"
              p={3}
              b={1}
              className={styles.warning}
            >
              <TriangleAlertIcon size={14} />
              <Text size={-1}>
                Failed to load blocks from <strong>{err.source}</strong>: {err.error}
              </Text>
            </Group>
          ))}
        </Stack>
      )}

      <div className={styles.grid}>
        {filteredBlocks.map((block) => {
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
                data-slot="registry-gallery-card-content"
                gap={4}
                p={6}
                pt={2}
                fullheight
                style={{ textAlign: "left" }}
              >
                <Text size={1} weight="bold">
                  {block.name}
                </Text>

                {block.description && (
                  <Text size={-1} shade="muted" balance>
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
                  <Group gap={2} ay="center">
                    {hasSource(block) && (
                      <Badge size="small">{block._source}</Badge>
                    )}
                    <Text size={-1} shade="muted">
                      {formatDate(block.updatedAt)}
                    </Text>
                  </Group>
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

type SourceFilterProps = {
  sources: SourceMeta[];
  blocks: BlockFile[];
  activeSource: string | null;
  onSelect: (source: string | null) => void;
};

const SourceFilter = ({
  sources,
  blocks,
  activeSource,
  onSelect,
}: SourceFilterProps) => {
  const countForSource = (label: string) =>
    blocks.filter((b) => hasSource(b) && b._source === label).length;

  const activeMeta = activeSource
    ? sources.find((s) => s.label === activeSource)
    : null;

  return (
    <Stack gap={2} fullwidth maxw={1152}>
      <Group gap={2} ay="center" className={styles.filterBar}>
        <button
          className={`${styles.filterPill} ${!activeSource ? styles.filterPillActive : ""}`}
          onClick={() => onSelect(null)}
        >
          All ({blocks.length})
        </button>
        {sources.map((source) => {
          const count = countForSource(source.label);
          return (
            <button
              key={source.label}
              className={`${styles.filterPill} ${activeSource === source.label ? styles.filterPillActive : ""}`}
              onClick={() =>
                onSelect(activeSource === source.label ? null : source.label)
              }
            >
              {source.label} ({count})
            </button>
          );
        })}
      </Group>
      {activeMeta && (activeMeta.description || activeMeta.author) && (
        <Group gap={4} ay="center">
          {activeMeta.description && (
            <Text size={-1} shade="muted">
              {activeMeta.description}
            </Text>
          )}
          {activeMeta.author && (
            <Text size={-1} shade="muted">
              by {activeMeta.author}
            </Text>
          )}
        </Group>
      )}
    </Stack>
  );
};
SourceFilter.displayName = "SourceFilter";

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

function hasSource(block: BlockFile): block is BlockFileWithSource {
  return "_source" in block && typeof (block as BlockFileWithSource)._source === "string";
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
