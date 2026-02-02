"use client";

import { useMemo } from "react";

import { Select } from "@uiid/forms";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";
import { useSavedBlocks } from "@/lib/use-saved-blocks";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const BlockInfoBar = () => {
  const activeBlockId = useChatStore((s) => s.activeBlockId);
  const activeVersionId = useChatStore((s) => s.activeVersionId);
  const { getVersionsForBlock, load } = useSavedBlocks();

  const versions = useMemo(
    () => (activeBlockId ? getVersionsForBlock(activeBlockId) : []),
    [activeBlockId, getVersionsForBlock]
  );

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  if (!activeBlockId || !activeVersion || versions.length === 0) return null;

  const items = versions.map((v) => ({
    label: `v${v.version} · ${formatDate(v.updatedAt)}`,
    value: v.id,
  }));

  return (
    <Group data-slot="block-info-bar" ax="space-between" ay="center" px={4} py={1} bb={1}>
      <Text size={0} weight="bold">
        {activeVersion.name}
      </Text>
      <Select
        size="small"
        ghost
        items={items}
        value={activeVersionId}
        onValueChange={(versionId: string | null) => {
          if (!versionId) return;
          const version = versions.find((v) => v.id === versionId);
          if (version) load(version);
        }}
      />
    </Group>
  );
};
BlockInfoBar.displayName = "BlockInfoBar";
