"use client";

import { useMemo } from "react";
import type { PreviewConfig } from "@uiid/registry";

import { CodeBlock } from "@uiid/code";
import { Stack } from "@uiid/layout";

import { TreePreviewList } from "@/components";
import { getPreviewComponent } from "@/lib/preview-registry";
import { ComponentDetailsPreview } from "@/components/component-details";
import { usePreviewContext } from "@/components/preview-context";
import { generateCodeExample } from "@/lib/generate-code-example";

interface PreviewProps {
  name: string;
  previews?: PreviewConfig[];
}

/**
 * MDX component to render a component preview with code example.
 * Uses tree-based previews from registry if available, otherwise falls back to legacy preview components.
 * Includes synchronized code examples that update with the active preview tab.
 */
export function Preview({ name, previews }: PreviewProps) {
  const PreviewComponent = getPreviewComponent(name);
  const ctx = usePreviewContext();

  const codeExamples = useMemo(
    () => (previews ?? []).map((p) => generateCodeExample(p)),
    [previews],
  );

  const activeIndex = ctx?.activeIndex ?? 0;
  const code = codeExamples[activeIndex] ?? codeExamples[0];

  if (previews && previews.length > 0) {
    return (
      <Stack fullwidth ax="stretch">
        <ComponentDetailsPreview>
          <TreePreviewList previews={previews} />
          {code && (
            <CodeBlock code={code} language="tsx" filename="Example.tsx" />
          )}
        </ComponentDetailsPreview>
      </Stack>
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
