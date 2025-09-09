import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const COLOR_DATA = {
  "blue": {
    "50": "#e3f2fd",
    "100": "#bbdefb",
    "200": "#90caf9",
    "300": "#64b5f6",
    "400": "#42a5f5",
    "500": "#2196f3",
    "600": "#1e88e5",
    "700": "#1976d2",
    "800": "#1565c0",
    "900": "#0d47a1"
  },
  "neutral": {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#eeeeee",
    "300": "#e0e0e0",
    "400": "#bdbdbd",
    "500": "#9e9e9e",
    "600": "#757575",
    "700": "#616161",
    "800": "#424242",
    "900": "#212121"
  },
  "green": {
    "50": "#e8f5e8",
    "100": "#c8e6c9",
    "200": "#a5d6a7",
    "300": "#81c784",
    "400": "#66bb6a",
    "500": "#4caf50",
    "600": "#43a047",
    "700": "#388e3c",
    "800": "#2e7d32",
    "900": "#1b5e20"
  },
  "red": {
    "50": "#ffebee",
    "100": "#ffcdd2",
    "200": "#ef9a9a",
    "300": "#e57373",
    "400": "#ef5350",
    "500": "#f44336",
    "600": "#e53935",
    "700": "#d32f2f",
    "800": "#c62828",
    "900": "#b71c1c"
  },
  "orange": {
    "50": "#fff3e0",
    "100": "#ffe0b2",
    "200": "#ffcc80",
    "300": "#ffb74d",
    "400": "#ffa726",
    "500": "#ff9800",
    "600": "#fb8c00",
    "700": "#f57c00",
    "800": "#ef6c00",
    "900": "#e65100"
  },
  "yellow": {
    "50": "#fffde7",
    "100": "#fff9c4",
    "200": "#fff59d",
    "300": "#fff176",
    "400": "#ffee58",
    "500": "#ffeb3b",
    "600": "#fdd835",
    "700": "#fbc02d",
    "800": "#f9a825",
    "900": "#f57f17"
  },
  "purple": {
    "50": "#f3e5f5",
    "100": "#e1bee7",
    "200": "#ce93d8",
    "300": "#ba68c8",
    "400": "#ab47bc",
    "500": "#9c27b0",
    "600": "#8e24aa",
    "700": "#7b1fa2",
    "800": "#6a1b9a",
    "900": "#4a148c"
  }
};

const meta = {
  title: "Tokens/Colors",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: ({}) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {Object.entries(COLOR_DATA).map(([group, shades]) => {
          const sortedShades = Object.entries(shades).sort(([a], [b]) => Number(a) - Number(b));

          return (
            <div key={group}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: 600, 
                marginBottom: "1rem",
                textTransform: "capitalize"
              }}>
                {group}
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "0.5rem"
              }}>
                {sortedShades.map(([shade, value]) => (
                  <ColorSwatch
                    key={shade}
                    name={`${group}-${shade}`}
                    value={value}
                    shade={shade}
                  />
                ))}
              </div>
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
  shade 
}: { 
  name: string; 
  value: string; 
  shade: string;
}) => {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "white"
    }}>
      <div
        style={{
          backgroundColor: value,
          height: "80px",
          width: "100%"
        }}
      />
      <div style={{
        padding: "0.5rem",
        fontSize: "0.875rem"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
          {shade}
        </div>
        <div style={{ color: "#666", fontSize: "0.75rem" }}>
          {value}
        </div>
        <div style={{ color: "#999", fontSize: "0.75rem" }}>
          --{name}
        </div>
      </div>
    </div>
  );
};
