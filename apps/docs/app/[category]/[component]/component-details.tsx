"use client";

import type { PropDocumentation, PreviewConfig } from "@uiid/registry";

import { CodeBlock } from "@uiid/code";
import { Stack, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { PropsTable, TreePreviewList } from "@/components";
import { getPreviewComponent } from "@/lib/preview-registry";

import {
  ComponentDetailsHeader,
  ComponentDetailsPreview,
} from "@/components/component-details";

const HEADER_SIZE = 3;

interface ComponentDetailsProps {
  name: string;
  packageName: string;
  category: string;
  description?: string;
  props: PropDocumentation[];
  sourceCode?: string;
  installHtml?: string;
  sourceHtml?: string;
  previews?: PreviewConfig[];
}

export function ComponentDetails({
  name,
  packageName,
  category,
  description,
  props,
  sourceCode,
  // installHtml,
  sourceHtml,
  previews,
}: ComponentDetailsProps) {
  const PreviewComponent = getPreviewComponent(name);

  return (
    <Stack data-slot="component-details" gap={6} p={8} pb={32} fullwidth>
      {/* Header */}
      <ComponentDetailsHeader
        name={name}
        description={description}
        packageName={packageName}
        category={category}
      />

      {/* Preview Section — tree-based if available, otherwise legacy component */}
      {previews && previews.length > 0 ? (
        <>
          <Separator />
          <Stack id="preview" gap={4} ax="stretch" fullwidth>
            <Header>Preview</Header>
            <ComponentDetailsPreview>
              <TreePreviewList previews={previews} />
            </ComponentDetailsPreview>
          </Stack>
        </>
      ) : PreviewComponent ? (
        <>
          <Separator />
          <Stack id="preview" gap={4} ax="stretch" fullwidth>
            <Header>Preview</Header>
            <ComponentDetailsPreview>
              <PreviewComponent />
            </ComponentDetailsPreview>
          </Stack>
        </>
      ) : null}

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
