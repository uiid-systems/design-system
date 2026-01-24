"use client";

import Link from "next/link";

import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { Card } from "@uiid/cards";

import { getComponentsWithPreviews } from "@/lib/preview-loader";

export default function ComponentsPage() {
  const components = getComponentsWithPreviews();

  return (
    <Stack gap={8} p={8} fullwidth>
      <Stack gap={2}>
        <Text render={<h1 />} size={5} weight="bold">
          Components
        </Text>
        <Text shade="muted">
          Select a component to load its preview tree as an initial UI state.
        </Text>
      </Stack>

      <Group gap={4} style={{ flexWrap: "wrap" }}>
        {components.map((component) => (
          <Link
            key={component.name}
            href={`/components/${component.name}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              title={component.name}
              description={component.description}
              style={{ minWidth: 240, cursor: "pointer" }}
            >
              <Text size={0} shade="muted">
                {component.package} · {component.previewCount}{" "}
                {component.previewCount === 1 ? "preview" : "previews"}
              </Text>
            </Card>
          </Link>
        ))}
      </Group>
    </Stack>
  );
}
