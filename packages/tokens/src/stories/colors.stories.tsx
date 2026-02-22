import type { StoryObj } from "@storybook/react-vite";

import generatedColorTokens from "../json/primitives/colors.generated.tokens.json";
import colorTokens from "../json/primitives/colors.tokens.json";
import shadeTokens from "../json/semantic/shade.tokens.json";
import toneTokens from "../json/semantic/tone.tokens.json";

type TokenValue = string | { colorSpace: string; components: number[]; hex: string };
type Token = { $value: TokenValue; $type?: string };

const extractTokens = (group: Record<string, Token | unknown>) =>
  Object.entries(group).reduce(
    (acc, [key, token]) => {
      if (key.startsWith("$")) return acc;
      const val = (token as Token).$value;
      acc[key] = typeof val === "object" && val !== null ? val.hex : val;
      return acc;
    },
    {} as Record<string, string>,
  );

const COLORS = extractTokens(colorTokens.color);
const SHADES = extractTokens(shadeTokens.shade);
const TONES = extractTokens(toneTokens.tone);

const TONE_GROUPS = ["positive", "warning", "critical", "info"] as const;

// Build SCALES map: { red: { "50": "#ffe3db", "100": "...", ... }, ... }
type ScaleStep = { $value: string };
type ScaleHue = Record<string, ScaleStep | string>;

const SCALES = Object.fromEntries(
  Object.entries(generatedColorTokens.color as unknown as Record<string, ScaleHue>)
    .filter(([key]) => !key.startsWith("$"))
    .map(([hue, steps]) => [
      hue,
      Object.fromEntries(
        Object.entries(steps)
          .filter(([step]) => !step.startsWith("$"))
          .map(([step, token]) => [
            step,
            (token as ScaleStep).$value,
          ]),
      ),
    ]),
);

const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

const meta = {
  title: "Tokens/Primitives/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "var(--shade-muted)",
      margin: 0,
    }}
  >
    {children}
  </h2>
);

const Swatch = ({
  name,
  cssVar,
  value,
  tall,
}: {
  name: string;
  cssVar: string;
  value?: string;
  tall?: boolean;
}) => (
  <div
    style={{
      border: "1px solid var(--shade-accent)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "var(--shade-surface)",
    }}
  >
    <div
      style={{
        backgroundColor: `var(--${cssVar})`,
        height: tall ? "80px" : "48px",
        width: "100%",
        borderBottom: "1px solid var(--shade-accent)",
      }}
    />
    <div style={{ padding: "0.5rem", fontSize: "0.75rem" }}>
      <div style={{ fontWeight: 600, marginBottom: "0.125rem" }}>{name}</div>
      {value && <div style={{ color: "var(--shade-muted)" }}>{value}</div>}
      <div style={{ color: "var(--shade-muted)", opacity: 0.7 }}>
        --{cssVar}
      </div>
    </div>
  </div>
);

const ScaleSwatch = ({ hue, step }: { hue: string; step: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
    <div
      style={{
        backgroundColor: `var(--color-${hue}-${step})`,
        width: "100%",
        height: "40px",
        borderRadius: "4px",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    />
    <span style={{ fontSize: "0.65rem", color: "var(--shade-muted)", textAlign: "center" }}>
      {step}
    </span>
  </div>
);

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <SectionLabel>Color Scales</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {Object.entries(SCALES).map(([hue]) => (
          <div key={hue} style={{ display: "grid", gridTemplateColumns: "80px 1fr", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--shade-foreground)", textTransform: "capitalize" }}>
              {hue}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: "0.25rem" }}>
              {SCALE_STEPS.map((step) => (
                <ScaleSwatch key={step} hue={hue} step={step} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Color Primitives</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {Object.entries(COLORS).map(([name, value]) => (
          <Swatch key={name} name={name} cssVar={`color-${name}`} value={value as string} tall />
        ))}
      </div>

      <SectionLabel>Shade Scale</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {Object.entries(SHADES)
          .filter(([key]) => !Number.isNaN(Number(key)))
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([name]) => (
            <Swatch key={name} name={name} cssVar={`shade-${name}`} />
          ))}
      </div>

      <SectionLabel>Shade Aliases</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {Object.entries(SHADES)
          .filter(([key]) => Number.isNaN(Number(key)))
          .map(([name]) => (
            <Swatch key={name} name={name} cssVar={`shade-${name}`} />
          ))}
      </div>

      <SectionLabel>Tones</SectionLabel>
      {TONE_GROUPS.map((tone) => (
        <div key={tone}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "var(--shade-foreground)",
            }}
          >
            {tone}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {Object.entries(TONES)
              .filter(([key]) => key === tone || key.startsWith(`${tone}-`))
              .map(([name]) => {
                const suffix = name === tone ? "" : name.slice(tone.length + 1);
                return (
                  <Swatch
                    key={name}
                    name={suffix || "base"}
                    cssVar={`tone-${name}`}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  ),
};
