"use client";

import { useRef } from "react";
import { Renderer } from "@json-render/react";
import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { useEnrichedSpec } from "@/lib/use-enriched-spec";
import { RenderedContainer } from "@/components";
import { ElementInspector } from "@/components/element-inspector";
import { LandingScreen } from "@/components/landing-screen";

export default function PlaygroundPage() {
  const spec = useChatStore((s) => s.tree);
  const enrichedSpec = useEnrichedSpec(spec);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!enrichedSpec) {
    return <LandingScreen />;
  }

  return (
    <RenderedContainer ref={containerRef}>
      <Renderer spec={enrichedSpec} registry={registry} />
      <ElementInspector containerRef={containerRef} />
    </RenderedContainer>
  );
}
