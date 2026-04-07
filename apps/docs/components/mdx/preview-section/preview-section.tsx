"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { TreePreview } from "@/components/tree-preview";

import { PreviewSectionWrapper } from "./preview-section-wrapper";
import { PreviewSectionCodeBlock } from "./preview-section-code-block";
import type { PreviewSectionProps } from "./preview-section.types";

export const PreviewSection = ({
  preview,
  code,
  prerenderedHtml,
  showLabel = true,
}: PreviewSectionProps) => {
  return (
    <Stack gap={4} fullwidth ax="stretch">
      {showLabel && (
        <Stack gap={2}>
          <Text render={<h3 />} size={2} weight="bold">
            {preview.label}
          </Text>
          {preview.description && (
            <Text size={1} shade="muted" balance>
              {preview.description}
            </Text>
          )}
        </Stack>
      )}

      <PreviewSectionWrapper>
        <TreePreview preview={preview} />
      </PreviewSectionWrapper>

      <PreviewSectionCodeBlock code={code} prerenderedHtml={prerenderedHtml} />
    </Stack>
  );
};
PreviewSection.displayName = "PreviewSection";
