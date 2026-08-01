import type { StoryObj } from "@storybook/react-vite";

import { Stack, Group, Text } from "@uiid/design-system";

import shadeTokens from "@tokens/json/semantic/shade.tokens.json";

/*
 * The neutral ladder. These are semantic aliases rather than primitives, which
 * is why they live under Semantic rather than alongside the ramps. The old
 * numbered --shade-1..12 scale they used to point at is gone; each alias now
 * carries the value that scale baked out, so nothing re-renders.
 */
type Derive = { method: string; light: string; dark: string };
type ShadeToken = {
  $value: string;
  $extensions?: { "org.uiid.derive"?: Derive };
};

const SHADES = Object.entries(shadeTokens.shade).filter(
  ([key]) => !key.startsWith("$"),
) as [string, ShadeToken][];

const meta = {
  title: "Tokens/Semantic/Shades",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Shades: Story = {
  render: () => (
    <Stack gap={3}>
      <Stack gap={1}>
        <Text size={2} weight="semibold">
          Shades
        </Text>
        <Text size={-1} shade="muted">
          Six neutral aliases, background through foreground. Each resolves via
          light-dark(), so the pair below is what the alias holds in each
          scheme.
        </Text>
      </Stack>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {SHADES.map(([name, token]) => {
          const derive = token.$extensions?.["org.uiid.derive"];
          return (
            <Stack
              key={name}
              gap={0}
              style={{
                border: "1px solid var(--shade-accent)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: `var(--shade-${name})`,
                  height: "72px",
                  borderBottom: "1px solid var(--shade-accent)",
                }}
              />
              <Stack gap={1} p={2}>
                <Text size={0} weight="semibold">
                  {name}
                </Text>
                <Text size={-1} shade="muted">
                  --shade-{name}
                </Text>
                {derive ? (
                  <Group gap={2}>
                    <Text size={-1} shade="muted">
                      {derive.light}
                    </Text>
                    <Text size={-1} shade="muted">
                      {derive.dark}
                    </Text>
                  </Group>
                ) : (
                  <Text size={-1} shade="muted">
                    {token.$value}
                  </Text>
                )}
              </Stack>
            </Stack>
          );
        })}
      </div>
    </Stack>
  ),
};
