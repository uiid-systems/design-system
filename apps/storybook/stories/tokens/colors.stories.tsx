import type { StoryObj } from "@storybook/react-vite";

import { Stack, Group, Text } from "@uiid/design-system";

import colorTokens from "@tokens/json/primitives/colors.tokens.json";

/*
 * The ramps are hand-authored, so this story reads colors.tokens.json directly.
 * There is no generated companion file any more — every step below is a value a
 * designer typed, and each hue's 500 is its authored anchor by construction.
 */
type Step = { $value: string };
type Ramp = Record<string, Step | string>;

const isRamp = (entry: unknown): entry is Ramp =>
  typeof entry === "object" && entry !== null && "500" in entry;

const entries = Object.entries(colorTokens.color).filter(
  ([key]) => !key.startsWith("$"),
);

/** A hue is an entry carrying a `500` step — the same test @uiid/tokens uses. */
const RAMPS = entries.filter(([, entry]) => isRamp(entry)) as [string, Ramp][];

/** white/black are deliberately outside the palette but still emitted. */
const BASE = entries.filter(([, entry]) => !isRamp(entry)) as [string, Step][];

const STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

const meta = {
  title: "Tokens/Primitives/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({
  cssVar,
  label,
  anchor,
}: {
  cssVar: string;
  label: string;
  anchor?: boolean;
}) => (
  <Stack gap={1}>
    <div
      style={{
        backgroundColor: `var(--${cssVar})`,
        height: "40px",
        borderRadius: "4px",
        border: anchor
          ? "2px solid var(--shade-foreground)"
          : "1px solid var(--shade-accent)",
      }}
    />
    <Text size={-1} shade="muted" style={{ textAlign: "center" }}>
      {label}
    </Text>
  </Stack>
);

export const Colors: Story = {
  render: () => (
    <Stack gap={5}>
      <Stack gap={2}>
        <Text size={2} weight="semibold">
          Ramps
        </Text>
        <Text size={-1} shade="muted">
          Eight hues, 50&ndash;950. The outlined step is the hue&rsquo;s authored
          anchor, which every ramp contains by construction.
        </Text>
        <Stack gap={3}>
          {RAMPS.map(([hue, ramp]) => (
            <Stack key={hue} gap={1}>
              <Group gap={2}>
                <Text
                  size={0}
                  weight="semibold"
                  style={{ textTransform: "capitalize" }}
                >
                  {hue}
                </Text>
                <Text size={-1} shade="muted">
                  {(ramp["500"] as Step)?.$value}
                </Text>
              </Group>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(11, 1fr)",
                  gap: "0.25rem",
                }}
              >
                {STEPS.map((step) => (
                  <Swatch
                    key={step}
                    cssVar={`color-${hue}-${step}`}
                    label={step}
                    anchor={step === "500"}
                  />
                ))}
              </div>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Text size={2} weight="semibold">
          Base
        </Text>
        <Text size={-1} shade="muted">
          Not palette hues. They are emitted because the shade aliases reference
          them, so tokens render even where no theme is loaded.
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {BASE.map(([name, token]) => (
            <Swatch
              key={name}
              cssVar={`color-${name}`}
              label={`${name} · ${token.$value}`}
            />
          ))}
        </div>
      </Stack>
    </Stack>
  ),
};
