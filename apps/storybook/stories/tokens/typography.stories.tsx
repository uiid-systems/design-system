import type { StoryObj } from "@storybook/react-vite";
import typographyTokens from "@tokens/json/primitives/typography.tokens.json";
import { Group, Stack, Table, Text } from "@uiid/design-system";

/*
 * Each step is authored once in typography.tokens.json as a DTCG composite
 * `typography` token, emitted as the `--text-<step>-*` custom properties, and
 * consumed by Text's `size` variant. The specimens render through <Text size>
 * rather than replaying the JSON as inline styles, so these stories only look
 * right when that whole chain holds — not merely when the JSON parses.
 */

type TypographyValue = {
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing: string;
};

/** Text's `size` variant is authored over the same -1…6 steps as the tokens. */
type TextSize = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TextFamily = "mono" | "serif" | "sans";

/** JSON keys are unordered and "-1" trails the others, so sort numerically. */
const STEPS = Object.entries(typographyTokens.text)
  .map(([step, token]) => ({
    step: Number(step) as TextSize,
    ...(token.$value as TypographyValue),
  }))
  .sort((a, b) => a.step - b.step);

/** `font` carries a group-level `$type`; that key is metadata, not a family. */
const FAMILIES = Object.entries(typographyTokens.font).filter(
  ([key]) => !key.startsWith("$"),
) as [TextFamily, { $value: string[] }][];

const SPECIMEN = "The quick brown fox jumps over the lazy dog";

const meta = {
  title: "Tokens/Primitives/Typography",
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The scale as it is actually applied — one specimen per step. */
export const Scale: Story = {
  render: () => (
    <Stack gap={3} fullwidth>
      <Text size={-1} shade="muted">
        Eight steps, &minus;1 through 6. Size, weight, line height and letter
        spacing travel together in one composite token, so a step is a
        typographic decision rather than four loose values.
      </Text>
      {STEPS.map(({ step }) => (
        <Group key={step} gap={3} ay="baseline" fullwidth>
          <Text
            size={-1}
            family="mono"
            shade="muted"
            style={{ minWidth: "2rem" }}
          >
            {step}
          </Text>
          <Text size={step}>{SPECIMEN}</Text>
        </Group>
      ))}
    </Stack>
  ),
};

/** The authored numbers behind each step, plus the variables they emit. */
export const Values: Story = {
  render: () => (
    <Table
      bordered
      striped
      items={STEPS.map(
        ({ step, fontSize, fontWeight, lineHeight, letterSpacing }) => ({
          step,
          fontSize,
          fontWeight,
          lineHeight,
          letterSpacing,
          variable: `--text-${step}-*`,
        }),
      )}
    />
  ),
};

/** The three family stacks, rendered through Text's `family` variant. */
export const Families: Story = {
  render: () => (
    <Stack gap={4} fullwidth>
      <Text size={-1} shade="muted">
        System stacks. The design system embeds no typefaces of its own, so each
        family resolves against whatever the reader&rsquo;s OS provides.
      </Text>
      {FAMILIES.map(([name, token]) => (
        <Stack key={name} gap={1} fullwidth>
          <Group gap={2} ay="baseline">
            <Text size={0} weight="semibold">
              {name}
            </Text>
            <Text size={-1} family="mono" shade="muted">
              --font-{name}
            </Text>
          </Group>
          <Text size={2} family={name}>
            {SPECIMEN}
          </Text>
          <Text size={-1} family="mono" shade="muted">
            {token.$value.join(", ")}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};
