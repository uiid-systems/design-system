"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Renderer } from "@json-render/react";
import { LoadingSpinner } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import type { BlockFile } from "@/lib/block-file";
import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { useEnrichedSpec } from "@/lib/use-enriched-spec";
import { RenderedContainer } from "@/components";
import { ElementInspector } from "@/components/element-inspector";

export default function RegistryBlockPage() {
  const { slug } = useParams<{ slug: string }>();
  const tree = useChatStore((s) => s.tree);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const enrichedSpec = useEnrichedSpec(tree);

  // Only fetch on cold loads (direct URL visit). When prev/next navigation
  // updates the store via navigateRegistryBlock + replaceState, useParams
  // retains the old slug — so we read store state imperatively to avoid
  // re-fetching the stale slug.
  useEffect(() => {
    const { tree, activeRegistryBlock } = useChatStore.getState();
    if (activeRegistryBlock && tree) return;

    let cancelled = false;

    async function load() {
      try {
        const [blockRes, allRes] = await Promise.all([
          fetch(`/api/blocks/${slug}`),
          fetch("/api/blocks"),
        ]);

        if (cancelled) return;

        if (!blockRes.ok) {
          setError("Block not found");
          return;
        }

        const block: BlockFile = await blockRes.json();
        const allBlocks: BlockFile[] = allRes.ok ? await allRes.json() : [];

        useChatStore.getState().setTree(block.tree);
        useChatStore.getState().setActiveRegistryBlock(block);
        useChatStore.getState().setRegistryBlocks(allBlocks);
      } catch {
        if (!cancelled) setError("Failed to load block");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (error) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth>
        {error}
      </Stack>
    );
  }

  if (!enrichedSpec) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth>
        <LoadingSpinner size={20} />
      </Stack>
    );
  }

  return (
    <RenderedContainer ref={containerRef}>
      <Renderer spec={enrichedSpec} registry={registry} />
      <ElementInspector containerRef={containerRef} />
    </RenderedContainer>
  );
}
