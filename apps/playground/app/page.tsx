"use client";

import { Renderer } from "@json-render/react";

import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { RenderedContainer } from "@/components";
// import { LandingScreen } from "@/components/landing-screen";

export default function PlaygroundPage() {
  const tree = useChatStore((s) => s.tree);

  return (
    <RenderedContainer>
      {/* {tree ? <Renderer tree={tree} registry={registry} /> : <LandingScreen />} */}
      <Renderer tree={tree} registry={registry} />
    </RenderedContainer>
  );
}
