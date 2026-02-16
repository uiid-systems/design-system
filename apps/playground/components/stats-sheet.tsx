import { countComponents, type ComponentCount } from "@uiid/registry";
import type { Spec } from "@json-render/core";

import { Button } from "@uiid/buttons";
import { BarChart3Icon } from "@uiid/icons";
import { Stack, Group, Separator } from "@uiid/layout";
import { Sheet } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";

export const StatsSheet = () => {
  const tree = useChatStore((s) => s.tree);
  const stats = tree ? countComponents(tree as Spec) : null;

  return (
    <Sheet
      data-slot="stats-sheet"
      title="Component breakdown"
      description="Usage counts for each component type in the current block."
      side="right"
      trigger={
        <Button
          tooltip="Component usage breakdown"
          disabled={!tree}
          size="small"
          ghost
        >
          <BarChart3Icon />
          Stats
        </Button>
      }
    >
      {stats && <ComponentList stats={stats} />}
    </Sheet>
  );
};
StatsSheet.displayName = "StatsSheet";

const ComponentList = ({ stats }: { stats: ComponentCount }) => {
  const sorted = Object.entries(stats.counts).sort(([, a], [, b]) => b - a);

  return (
    <Stack gap={4} pt={4} ax="stretch" fullwidth>
      <Group gap={4} ay="center">
        <Text size={-1} weight="bold" shade="muted">
          {stats.total} total
        </Text>
        &middot;
        <Text size={-1} weight="bold" shade="muted">
          {stats.unique} unique
        </Text>
      </Group>
      <Separator />
      <Stack gap={4} ax="stretch">
        {sorted.map(([type, count]) => (
          <Group key={type} ax="space-between" fullwidth>
            <Text size={0} weight="bold">
              {type}
            </Text>
            <Text size={0} shade="muted">
              {count}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};
