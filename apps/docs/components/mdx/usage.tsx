"use client";

import { useMemo } from "react";
import type { PreviewConfig } from "@uiid/registry";

import { CodeBlock } from "@uiid/code";

import { usePreviewContext } from "@/components/preview-context";
import { generateCodeExample } from "@/lib/generate-code-example";

interface UsageProps {
  previews?: PreviewConfig[];
}

/**
 * MDX component that renders a code example for the active preview.
 * Reads from PreviewContext to stay in sync with the Preview component's active tab.
 */
export function Usage({ previews }: UsageProps) {
  const ctx = usePreviewContext();

  const codeExamples = useMemo(
    () => (previews ?? []).map((p) => generateCodeExample(p)),
    [previews],
  );

  if (!previews || previews.length === 0 || codeExamples.length === 0) {
    return null;
  }

  const activeIndex = ctx?.activeIndex ?? 0;
  const code = codeExamples[activeIndex] ?? codeExamples[0];

  return <CodeBlock code={code} language="tsx" filename="Example.tsx" />;
}
