"use client";

import { Renderer } from "@json-render/react";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { RenderedContainer } from "@/components";

export default function PlaygroundPage() {
  const tree = useChatStore((s) => s.tree);

  return (
    <RenderedContainer>
      {tree ? (
        <Renderer tree={tree} registry={registry} />
      ) : (
        <Text shade="muted">Generated UI will appear here</Text>
      )}
    </RenderedContainer>
  );
}
