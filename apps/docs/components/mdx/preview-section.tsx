"use client";

import type { PreviewConfig } from "@uiid/registry";

import { CodeBlock } from "@uiid/code";
import { Blocks, ChevronDown } from "@uiid/icons";
import { Collapsible } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { TreePreview } from "@/components/tree-preview";
import { CREATE_URL } from "@/constants";

import "./preview-section.css";

function encodeTree(tree: PreviewConfig["tree"]): string {
  return btoa(encodeURIComponent(JSON.stringify(tree)));
}

interface PreviewSectionProps {
  preview: PreviewConfig;
  code?: string;
  prerenderedHtml?: string;
  showLabel?: boolean;
}

export function PreviewSection({
  preview,
  code,
  prerenderedHtml,
  showLabel = true,
}: PreviewSectionProps) {
  const builderUrl = `${CREATE_URL}/#${encodeTree(preview.tree)}`;

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

      <Stack
        data-slot="preview-section"
        gap={4}
        ax="center"
        ay="center"
        fullwidth
        py={10}
        px={6}
        className="bg-(--shade-background)"
        style={{ borderRadius: "var(--radius-2)", minHeight: "12rem" }}
      >
        <TreePreview preview={preview} />
      </Stack>

      {code && (
        <Collapsible
          trigger={
            <Group gap={2} ay="center">
              <Text size={0} shade="muted">
                Show code
              </Text>
              <ChevronDown
                size={14}
                style={{
                  color: "var(--shade-muted)",
                  transition: "transform 150ms ease",
                }}
                data-collapsible-chevron
              />
            </Group>
          }
          TriggerProps={{
            nativeButton: false,
            style: {
              cursor: "pointer",
            },
          }}
        >
          <CodeBlock
            code={code}
            language="tsx"
            filename="Example.tsx"
            html={prerenderedHtml}
            HeaderProps={{
              children: (
                <a
                  href={builderUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    color: "var(--shade-muted)",
                    fontSize: "var(--font-size--1)",
                    textDecoration: "none",
                    marginLeft: "auto",
                  }}
                >
                  <Blocks size={14} />
                  Open in Playground
                </a>
              ),
            }}
          />
        </Collapsible>
      )}
    </Stack>
  );
}
