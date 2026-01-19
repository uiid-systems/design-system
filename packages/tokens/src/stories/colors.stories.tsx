import type { StoryObj } from "@storybook/react-vite";

import colorTokens from "../json/colors.tokens.json";

// Transform token structure to flat color data
const COLOR_DATA = Object.entries(colorTokens.colors).reduce(
  (acc, [colorGroup, shades]) => {
    if (colorGroup.startsWith("$")) return acc; // Skip metadata

    acc[colorGroup] = Object.entries(
      shades as Record<string, { $value: string }>,
    ).reduce(
      (shadeAcc, [shade, token]) => {
        if (shade.startsWith("$")) return shadeAcc; // Skip metadata
        shadeAcc[shade] = token.$value;
        return shadeAcc;
      },
      {} as Record<string, string>,
    );

    return acc;
  },
  {} as Record<string, Record<string, string>>,
);

const meta = {
  title: "Tokens/Primitives/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: ({}) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {Object.entries(COLOR_DATA).map(([group, shades]) => {
          const sortedShades = Object.entries(shades).sort(
            ([a], [b]) => Number(a) - Number(b),
          );

          return (
            <div
              key={group}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {sortedShades.map(([shade, value]) => (
                <ColorSwatch
                  key={shade}
                  name={`${group}-${shade}`}
                  value={value}
                  shade={shade}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  },
};

const ColorSwatch = ({
  name,
  value,
  shade,
}: {
  name: string;
  value: string;
  shade: string;
}) => {
  return (
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
          backgroundColor: `var(--colors-${name})`,
          height: "80px",
          width: "100%",
        }}
      />
      <div
        style={{
          padding: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{shade}</div>
        <div style={{ color: "#666", fontSize: "0.75rem" }}>{value}</div>
        <div style={{ color: "#999", fontSize: "0.75rem" }}>
          --colors-{name}
        </div>
      </div>
    </div>
  );
};
