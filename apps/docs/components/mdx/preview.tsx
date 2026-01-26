"use client";

import type { PreviewConfig } from "@uiid/registry";

import { TreePreviewList } from "@/components";
import { getPreviewComponent } from "@/lib/preview-registry";
import { ComponentDetailsPreview } from "@/components/component-details";

interface PreviewProps {
  name: string;
  previews?: PreviewConfig[];
}

/**
 * MDX component to render a component preview.
 * Uses tree-based previews from registry if available, otherwise falls back to legacy preview components.
 */
export function Preview({ name, previews }: PreviewProps) {
  const PreviewComponent = getPreviewComponent(name);

  if (previews && previews.length > 0) {
    return (
      <ComponentDetailsPreview>
        <TreePreviewList previews={previews} />
      </ComponentDetailsPreview>
    );
  }

  if (PreviewComponent) {
    return (
      <ComponentDetailsPreview>
        <PreviewComponent />
      </ComponentDetailsPreview>
    );
  }

  return null;
}
