"use client";

import { useState } from "react";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Textarea } from "@uiid/forms";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";

import { exampleTree } from "./exampleTree";

export default function PlaygroundPage() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(exampleTree, null, 2),
  );
  const [tree, setTree] = useState<UITree>(exampleTree);
  const [error, setError] = useState<string | null>(null);

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setTree(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <JSONUIProvider
      registry={registry}
      actionHandlers={{
        submit: async () => {
          alert("Submit action triggered!");
        },
        navigate: async () => {
          alert("Navigate action triggered!");
        },
      }}
    >
      <Stack gap={6} p={6} fullwidth>
        {/* Header */}
        <Stack gap={4}>
          <Text size={4} weight="bold">
            UIID + json-render Playground
          </Text>
          <Text>
            Edit the JSON below to see UIID components rendered in real-time.
          </Text>
        </Stack>

        {/* Main content */}
        <Group gap={6} fullwidth evenly>
          {/* JSON Editor */}
          <Stack gap={4}>
            <Text size={2} weight="bold">
              JSON Input
            </Text>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={20}
              fullwidth
              style={{
                fontFamily: "monospace",
                backgroundColor: "var(--shade-surface)",
              }}
            />

            {error && (
              <Text tone="negative" size={0}>
                Error: {error}
              </Text>
            )}
            <Button onClick={handleParseJson} fullwidth>
              Render JSON
            </Button>
          </Stack>

          {/* Preview */}
          <Stack gap={4}>
            <Text size={2} weight="bold">
              Preview
            </Text>
            <Renderer tree={tree} registry={registry} />
          </Stack>
        </Group>

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
      </Stack>
    </JSONUIProvider>
  );
}
