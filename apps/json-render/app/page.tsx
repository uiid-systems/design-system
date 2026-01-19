"use client";

import { useState, useEffect } from "react";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Button } from "@uiid/buttons";
import { CodeBlock, CodeEditor } from "@uiid/code";
import { Tabs } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

import { MOCK_UI_TREE } from "./mocks";

export default function PlaygroundPage() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(MOCK_UI_TREE, null, 2),
  );
  const [tree, setTree] = useState<UITree>(MOCK_UI_TREE);
  const [parseError, setParseError] = useState<string | null>(null);
  const [jsxCode, setJsxCode] = useState<string>("");

  useEffect(() => {
    treeToFormattedJsx(tree).then(setJsxCode);
  }, [tree]);

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setTree(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <JSONUIProvider
      registry={registry}
      actionHandlers={{
        submit: async () => {
          alert("Submit action triggered!");
        },
        reset: async () => {
          alert("Reset action triggered!");
        },
        navigate: async () => {
          alert("Navigate action triggered!");
        },
      }}
    >
      <Stack gap={8} p={8} fullwidth>
        {/* Header */}
        <Stack gap={4}>
          <Text size={5} weight="bold">
            uiid + json-render
          </Text>
          <Text shade="muted">
            Edit the JSON below to build UI with UIID components.
          </Text>
        </Stack>

        {/* Component list */}
        <Stack gap={3}>
          <Text size={2} weight="bold">
            Available Components
          </Text>
          <Group gap={2} style={{ flexWrap: "wrap" }}>
            {Object.keys(registry).map((name) => (
              <Text
                key={name}
                size={0}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#262626",
                  borderRadius: 4,
                }}
              >
                {name}
              </Text>
            ))}
          </Group>
        </Stack>

        {/* Main content */}
        <Group gap={6} fullwidth evenly ay="start">
          {/* JSON Editor */}
          <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
            <Text size={2} weight="bold">
              JSON Input
            </Text>
            <CodeEditor
              value={jsonInput}
              onValueChange={setJsonInput}
              language="json"
              filename="ui-tree.json"
              rows={20}
            />

            {parseError && (
              <Text tone="negative" size={0}>
                Parse Error: {parseError}
              </Text>
            )}
            <Button onClick={handleParseJson} fullwidth>
              Update Preview
            </Button>
          </Stack>

          {/* Output Tabs */}
          <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
            <Tabs
              items={[
                {
                  label: "Preview",
                  value: "preview",
                  render: <Renderer tree={tree} registry={registry} />,
                },
                {
                  label: "JSX",
                  value: "jsx",
                  render: (
                    <CodeBlock
                      code={jsxCode}
                      language="tsx"
                      filename="component.tsx"
                      showLineNumbers
                    />
                  ),
                },
              ]}
              keepMounted
            />
          </Stack>
        </Group>
      </Stack>
    </JSONUIProvider>
  );
}
