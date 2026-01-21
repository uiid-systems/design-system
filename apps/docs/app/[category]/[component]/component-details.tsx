"use client";

import type { PropDocumentation } from "@uiid/registry";

import { Stack, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { CodeBlock } from "@uiid/code";

import { PropsTable, ComponentPreview } from "@/components";
import { getPreviewComponent } from "@/lib/preview-registry";

type ComponentDetailsProps = {
  name: string;
  packageName: string;
  description?: string;
  props: PropDocumentation[];
  sourceCode?: string;
};

export function ComponentDetails({
  name,
  packageName,
  description,
  props,
  sourceCode,
}: ComponentDetailsProps) {
  const PreviewComponent = getPreviewComponent(name);

  return (
    <Stack gap={6} p={8}>
      {/* Header */}
      <Stack gap={2}>
        <Text render={<h1 />} size={6} weight="bold">
          {name}
        </Text>
        {description && (
          <Text shade="muted" size={1}>
            {description}
          </Text>
        )}
        <Text size={0} family="mono" shade="accent">
          {packageName}
        </Text>
      </Stack>

      {/* Preview Section */}
      {PreviewComponent && (
        <>
          <Separator />
          <Stack gap={4}>
            <Text render={<h2 />} size={4} weight="bold">
              Preview
            </Text>
            <ComponentPreview>
              <PreviewComponent />
            </ComponentPreview>
          </Stack>
        </>
      )}

      {/* Installation */}
      <Separator />
      <Stack gap={4}>
        <Text render={<h2 />} size={4} weight="bold">
          Installation
        </Text>
        <CodeBlock code={`pnpm add ${packageName}`} language="bash" />
      </Stack>

      {/* Source Code */}
      {sourceCode && (
        <>
          <Separator />
          <Stack gap={4}>
            <Text render={<h2 />} size={4} weight="bold">
              Example
            </Text>
            <CodeBlock code={sourceCode} language="tsx" />
          </Stack>
        </>
      )}

      {/* Props Section */}
      <Separator />
      <Stack gap={4}>
        <Text render={<h2 />} size={4} weight="bold">
          Props
        </Text>
        <PropsTable props={props} />
      </Stack>
    </Stack>
  );
}
