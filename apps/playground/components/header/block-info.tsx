"use client";

import { useMemo } from "react";

import { Button } from "@uiid/buttons";
import { Select, type SelectProps } from "@uiid/forms";
import { ChevronLeftIcon, ChevronRightIcon } from "@uiid/icons";
import { Group, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";
import { useSavedBlocks } from "@/lib/use-saved-blocks";

import { NewChatButton } from "../new-chat-button";
import { OpenBlocksPanel } from "../open-blocks-panel";
import { SaveButton } from "../save-button";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const BlockInfo = () => {
  const activeBlockId = useChatStore((s) => s.activeBlockId);
  const activeVersionId = useChatStore((s) => s.activeVersionId);
  const activeRegistryBlock = useChatStore((s) => s.activeRegistryBlock);
  const registryBlocks = useChatStore((s) => s.registryBlocks);
  const navigateRegistryBlock = useChatStore((s) => s.navigateRegistryBlock);
  const { getVersionsForBlock, load } = useSavedBlocks();

  const versions = useMemo(
    () => (activeBlockId ? getVersionsForBlock(activeBlockId) : []),
    [activeBlockId, getVersionsForBlock],
  );

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  const items = versions.map((v) => ({
    label: `ver. ${v.version} · ${formatDate(v.updatedAt)}`,
    value: v.id,
  }));

  const handleVersionChange = (versionId: string | null) => {
    if (!versionId) return;
    const version = versions.find((v) => v.id === versionId);
    if (version) load(version);
  };

  const canNavigate = activeRegistryBlock && registryBlocks.length > 1;

  return (
    <BlockInfoContainer>
      <Group>
        <NewChatButton />
        <OpenBlocksPanel />
        <SaveButton />
      </Group>

      <Separator orientation="vertical" mr={2} />

      {canNavigate && (
        <>
          <Group>
            <Button
              tooltip="Previous block"
              onClick={() => navigateRegistryBlock("prev")}
              size="xsmall"
              variant="inverted"
              square
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              tooltip="Next block"
              onClick={() => navigateRegistryBlock("next")}
              size="xsmall"
              variant="inverted"
              square
            >
              <ChevronRightIcon />
            </Button>
          </Group>
          <Separator orientation="vertical" mr={4} />
        </>
      )}

      <BlockInfoTitle>
        {activeRegistryBlock
          ? activeRegistryBlock.name
          : (activeVersion?.name ?? "Untitled block")}
      </BlockInfoTitle>

      <BlockInfoVersionSelector
        items={items}
        disabled={items.length <= 0}
        placeholder="Select version"
        value={activeVersionId}
        onValueChange={handleVersionChange}
      />
    </BlockInfoContainer>
  );
};
BlockInfo.displayName = "BlockInfo";

const BlockInfoContainer = ({ children }: React.PropsWithChildren) => (
  <Group data-slot="block-info-container" ay="center" px={4} py={1} gap={2}>
    {children}
  </Group>
);
BlockInfoContainer.displayName = "BlockInfoContainer";

const BlockInfoTitle = ({ children }: React.PropsWithChildren) => (
  <Text size={0} weight="bold">
    {children}
  </Text>
);
BlockInfoTitle.displayName = "BlockInfoTitle";

const BlockInfoVersionSelector = (props: SelectProps<string>) => (
  <Select size="small" ghost {...props} />
);
BlockInfoVersionSelector.displayName = "BlockInfoVersionSelector";
