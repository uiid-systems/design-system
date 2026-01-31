import type { StoryObj } from "@storybook/react-vite";

import colorTokens from "../json/colors.tokens.json";

type Token = { $value: string; $type: string };

const extractTokens = (group: Record<string, Token | unknown>) =>
  Object.entries(group).reduce(
    (acc, [key, token]) => {
      if (key.startsWith("$")) return acc;
      acc[key] = (token as Token).$value;
      return acc;
    },
    {} as Record<string, string>,
  );

const COLORS = extractTokens(colorTokens.color);
const SHADES = extractTokens(colorTokens.shade);
const TONES = extractTokens(colorTokens.tone);

const TONE_GROUPS = ["positive", "warning", "critical", "info"] as const;

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

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <SectionLabel>Color Primitives</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {Object.entries(COLORS).map(([name]) => (
          <Swatch key={name} name={name} cssVar={`color-${name}`} tall />
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
