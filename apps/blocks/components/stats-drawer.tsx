import { countComponents, type ComponentCount } from "@uiid/registry";
import type { UISpec } from "@/lib/catalog";

import { Button } from "@uiid/buttons";
import { BarChart3Icon } from "@uiid/icons";
import { Stack, Group, Separator } from "@uiid/layout";
import { Drawer } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";

export const StatsDrawer = () => {
  const tree = useChatStore((s) => s.tree);
  const stats = tree ? countComponents(tree as UISpec) : null;

  return (
    <Drawer
      data-slot="stats-sheet"
      title="Component breakdown"
      description="Usage counts for each component type in the current block."
      swipeDirection="right"
      trigger={
        <Button
          tooltip="Component usage breakdown"
          disabled={!tree}
          size="small"
          variant="ghost"
        >
          <BarChart3Icon />
          Stats
        </Button>
      }
    >
      {stats && <ComponentList stats={stats} />}
    </Drawer>
  );
};
StatsDrawer.displayName = "StatsDrawer";

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
