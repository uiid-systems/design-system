"use client";

import { useMemo, useRef } from "react";
import { Renderer } from "@json-render/react";
import type { UISpec } from "@/lib/catalog";
import { registry } from "@/lib/components";
import { useChatStore } from "@/lib/store";
import { RenderedContainer } from "@/components";
import { ElementInspector } from "@/components/element-inspector";
import { RegistryGallery } from "@/components/registry-gallery";

/**
 * Enrich spec elements with their record key so component renderers
 * can stamp `data-element-key` on the DOM for the inspector.
 */
function useEnrichedSpec(spec: UISpec | null) {
  return useMemo(() => {
    if (!spec) return null;
    const elements = { ...spec.elements };
    for (const key of Object.keys(elements)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      elements[key] = { ...(elements[key] as any), key };
    }
    return { ...spec, elements } as UISpec;
  }, [spec]);
}

export default function PlaygroundPage() {
  const spec = useChatStore((s) => s.tree);
  const enrichedSpec = useEnrichedSpec(spec);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!enrichedSpec) {
    return <RegistryGallery />;
  }

  return (
    <RenderedContainer ref={containerRef}>
      <Renderer spec={enrichedSpec} registry={registry} />
      <ElementInspector containerRef={containerRef} />
    </RenderedContainer>
  );
}
