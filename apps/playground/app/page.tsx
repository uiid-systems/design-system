"use client";

import { useRef } from "react";
import { Renderer } from "@json-render/react";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { RenderedContainer } from "@/components";
import { ElementInspector } from "@/components/element-inspector";
// import { LandingScreen } from "@/components/landing-screen";

export default function PlaygroundPage() {
  const tree = useChatStore((s) => s.tree);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <RenderedContainer ref={containerRef}>
      {/* {tree ? <Renderer tree={tree} registry={registry} /> : <LandingScreen />} */}
      <Renderer tree={tree} registry={registry} />
      <ElementInspector containerRef={containerRef} />
    </RenderedContainer>
  );
}
