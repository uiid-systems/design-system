import type { StoryObj } from "@storybook/react-vite";

import {
  PALETTE_HUES,
  paletteColorStyles,
  paletteAnchor,
  type PaletteColor,
  Stack,
  Group,
  Text,
} from "@uiid/design-system";

import styles from "./palette.stories.module.css";

/*
 * The semantic palette: eight treatments per hue, each a plain light-dark() pair
 * of primitive references. Components choose a treatment and never name a hue or
 * a step, which is why a tinted Card and a subtle Button cannot drift apart.
 *
 * The hue list is derived from the token JSON, so a ramp added there shows up
 * here without this file changing.
 */
const meta = {
  title: "Tokens/Semantic/Palette",
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The stack a single hue produces, from the outside in. */
const HueStack = ({
  hue,
  annotated,
}: {
  hue: PaletteColor;
  annotated?: boolean;
}) => (
  <Stack className={paletteColorStyles[hue]} gap={2}>
    <Stack className={styles.tint} gap={2} p={3}>
      <Group gap={2} ay="center">
        <Text size={0} weight="semibold" style={{ textTransform: "capitalize" }}>
          {hue}
        </Text>
        <Text size={-1}>{paletteAnchor(hue)}</Text>
      </Group>

      {annotated && (
        <Text size={-1}>--palette-tint / --palette-on-tint / --palette-tint-border</Text>
      )}

      <Stack className={styles.fill} px={3} py={2} gap={1}>
        <Text size={-1} weight="medium">
          Filled
        </Text>
        {annotated && (
          <Text size={-1}>--palette-fill / --palette-on-fill</Text>
        )}
      </Stack>
    </Stack>

    <Stack gap={0} px={1}>
      <Text size={-1} className={styles.text} weight="medium">
        Text on the page background
      </Text>
      {annotated && (
        <Text size={-1} shade="muted">
          --palette-text
        </Text>
      )}
    </Stack>
  </Stack>
);

export const Palette: Story = {
  render: () => (
    <Stack gap={4}>
      <Stack gap={1}>
        <Text size={2} weight="semibold">
          Palette
        </Text>
        <Text size={-1} shade="muted">
          Hover a surface to see its hover treatment. Every pairing clears WCAG
          AA against the surface it is named for; the tightest is 5.10:1.
        </Text>
      </Stack>

      <Stack gap={2}>
        <Text size={0} weight="semibold">
          Anatomy
        </Text>
        <div style={{ maxWidth: "320px" }}>
          <HueStack hue={PALETTE_HUES[0]} annotated />
        </div>
      </Stack>

      <Stack gap={2}>
        <Text size={0} weight="semibold">
          All hues
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {PALETTE_HUES.map((hue) => (
            <HueStack key={hue} hue={hue} />
          ))}
        </div>
      </Stack>
    </Stack>
  ),
};
