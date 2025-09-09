import type { StoryObj } from "@storybook/react-vite";
import React from "react";

const SPACING_TOKENS = ["scale","scaleInline","scaleBlock"];

const meta = {
  title: "Tokens/Spacing",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: ({}) => {
    const [computedValues, setComputedValues] = React.useState<
      Record<string, string>
    >({});

    React.useEffect(() => {
      const computeValues = () => {
        const root = document.documentElement;
        const values: Record<string, string> = {};

        SPACING_TOKENS.forEach((token) => {
          const cssVar = token === 'scaleInline' ? 'scaleInline' : 
                        token === 'scaleBlock' ? 'scaleBlock' : token;
          values[token] = getComputedStyle(root)
            .getPropertyValue(`--${cssVar}`)
            .trim();
        });

        setComputedValues(values);
      };

      computeValues();
      const timeout = setTimeout(computeValues, 200);

      return () => clearTimeout(timeout);
    }, []);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
          Spacing Tokens
        </h2>
        {SPACING_TOKENS.map((token) => {
          const value = computedValues[token] || '';
          const cssVar = token === 'scaleInline' ? 'scaleInline' : 
                        token === 'scaleBlock' ? 'scaleBlock' : token;

          return (
            <div key={token} style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #e0e0e0",
              borderRadius: "8px"
            }}>
              <div style={{ minWidth: "120px" }}>
                <div style={{ fontWeight: 600 }}>{token}</div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  --{cssVar}
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#999" }}>
                {value}
              </div>
              <div
                style={{
                  backgroundColor: "#2196f3",
                  height: "20px",
                  width: value,
                  minWidth: "2px"
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
};
