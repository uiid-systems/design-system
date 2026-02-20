"use client";

import {
  ComponentIcon,
  PackageIcon,
  LayoutGridIcon,
  WandSparklesIcon,
} from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { componentNames } from "@uiid/registry";

import { useRegistryBlocks } from "@/lib/use-registry-blocks";

const STATS_ITEMS = [
  {
    icon: ComponentIcon,
    getValue: (componentCount: number) => String(componentCount),
    label: "Components",
    description: "Accessible, composable primitives",
  },
  {
    icon: PackageIcon,
    getValue: (_: number, blockCount: number) => String(blockCount),
    label: "Blocks",
    description: "Pre-built layouts ready to use",
  },
  {
    icon: LayoutGridIcon,
    getValue: () => "7",
    label: "Categories",
    description: "Layout, forms, overlays, and more",
  },
  {
    icon: WandSparklesIcon,
    getValue: () => "AI",
    label: "Powered",
    description: "Generate UIs from natural language",
  },
];

export const LandingScreenStats = () => {
  const { blocks } = useRegistryBlocks();
  const componentCount = componentNames.length;
  const blockCount = blocks.length;

  return (
    <Stack gap={8} ax="center" fullwidth>
      <Stack gap={3} ax="center">
        <Text size={4} weight="bold" style={{ textAlign: "center" }}>
          Built on real components
        </Text>
        <Text shade="muted" style={{ textAlign: "center" }} balance>
          Every generated UI uses production-grade UIID components with
          full accessibility and design token support.
        </Text>
      </Stack>

      <Group gap={4} evenly fullwidth>
        {STATS_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Stack key={item.label} ax="center" gap={2} p={6}>
              <Text size={6} weight="bold">
                {item.getValue(componentCount, blockCount)}
              </Text>
              <Group gap={2} ay="center">
                <Icon size={16} />
                <Text size={0} weight="bold">
                  {item.label}
                </Text>
              </Group>
              <Text size={-1} shade="muted" style={{ textAlign: "center" }}>
                {item.description}
              </Text>
            </Stack>
          );
        })}
      </Group>
    </Stack>
  );
};
LandingScreenStats.displayName = "LandingScreenStats";
