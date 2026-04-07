"use client";

import type { PreviewConfig } from "@uiid/registry";

import { Stack } from "@uiid/layout";

import { getPreviewComponent } from "@/lib/preview-registry";

import { PreviewSection } from "./preview-section";

interface PreviewProps {
  name: string;
  previews?: PreviewConfig[];
  codeExamples?: string[];
  prerenderedHtml?: string[];
}

/**
 * MDX component to render component previews in a section-based layout.
 * Each preview variant gets its own section with heading, live preview,
 * collapsible code block, and playground link.
 */
export function Preview({
  name,
  previews,
  codeExamples = [],
  prerenderedHtml = [],
}: PreviewProps) {
  if (previews && previews.length > 0) {
    const isSingle = previews.length === 1;

    return (
      <Stack gap={12} fullwidth ax="stretch" mt={6}>
        {previews.map((preview, i) => (
          <PreviewSection
            key={preview.label}
            preview={preview}
            code={codeExamples[i]}
            prerenderedHtml={prerenderedHtml[i]}
            showLabel={!isSingle}
          />
        ))}
      </Stack>
    );
  }

  const PreviewComponent = getPreviewComponent(name);

  if (PreviewComponent) {
    return (
      <Stack
        data-slot="preview-container"
        ax="center"
        ay="center"
        fullwidth
        py={10}
        px={6}
        mt={6}
      >
        <PreviewComponent />
      </Stack>
    );
  }

  return null;
}
