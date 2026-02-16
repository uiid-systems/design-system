"use client";

import { useRef } from "react";
import { Renderer } from "@json-render/react";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { RenderedContainer } from "@/components";
import { ElementInspector } from "@/components/element-inspector";
import { RegistryGallery } from "@/components/registry-gallery";

export default function PlaygroundPage() {
  const spec = useChatStore((s) => s.tree);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!spec) {
    return <RegistryGallery />;
  }

  return (
    <RenderedContainer ref={containerRef}>
      <Renderer spec={spec} registry={registry} />
      <ElementInspector containerRef={containerRef} />
    </RenderedContainer>
  );
}
