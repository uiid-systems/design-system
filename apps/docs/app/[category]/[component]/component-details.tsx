"use client";

import type { PropDocumentation } from "@uiid/registry";

import { Stack, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { CodeBlock } from "@uiid/code";

import { PropsTable, ComponentPreview } from "@/components";
import { getPreviewComponent } from "@/lib/preview-registry";

const HEADER_SIZE = 3;

type ComponentDetailsProps = {
  name: string;
  packageName: string;
  description?: string;
  props: PropDocumentation[];
  sourceCode?: string;
  installHtml?: string;
  sourceHtml?: string;
};

export function ComponentDetails({
  name,
  // packageName,
  description,
  props,
  sourceCode,
  // installHtml,
  sourceHtml,
}: ComponentDetailsProps) {
  const PreviewComponent = getPreviewComponent(name);

  return (
    <Stack data-slot="component-details" gap={6} p={8} pb={32} fullwidth>
      {/* Header */}
      <Text render={<h1 />} size={6} weight="bold">
        {name}
      </Text>
      {description && (
        <Text shade="muted" size={1}>
          {description}
        </Text>
      )}

      {/* Preview Section */}
      {PreviewComponent && (
        <>
          <Separator />
          <Stack id="preview" gap={4} ax="stretch" fullwidth>
            <Header>Preview</Header>
            <ComponentPreview>
              <PreviewComponent />
            </ComponentPreview>
          </Stack>
        </>
      )}

      {sourceCode && (
        <>
          <Separator />
          <Stack id="usage" gap={4} ax="stretch" fullwidth>
            <Header>Usage</Header>
            <CodeBlock code={sourceCode} language="tsx" html={sourceHtml} />
          </Stack>
        </>
      )}

      {/* Props Section */}
      <Separator />
      <Stack id="props" gap={4} ax="stretch" fullwidth>
        <Header>Props</Header>
        <PropsTable props={props} />
      </Stack>
    </Stack>
  );
}

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text render={<h2 />} size={HEADER_SIZE} weight="bold">
      {children}
    </Text>
  );
};
