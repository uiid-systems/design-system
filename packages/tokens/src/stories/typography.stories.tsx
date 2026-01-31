import React from "react";
import type { StoryObj } from "@storybook/react-vite";

import typographyTokens from "../json/primitives/typography.tokens.json";

const meta = {
  title: "Tokens/Primitives/Typography",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => {
    const textTokens = typographyTokens.typography.text;
    const levels = Object.keys(textTokens).sort(
      (a, b) => Number(a) - Number(b),
    );

    return (
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        {/* Token Values Table */}
        <h2 style={{ marginBottom: "1rem", color: "var(--shade-foreground)" }}>
          Typography Tokens
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3rem repeat(4, 1fr)",
            gap: "0.75rem",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          {/* Header */}
          <div style={{ fontWeight: "600", color: "#666" }}>Level</div>
          <div style={{ fontWeight: "600", color: "#666" }}>Size</div>
          <div style={{ fontWeight: "600", color: "#666" }}>Weight</div>
          <div style={{ fontWeight: "600", color: "#666" }}>Leading</div>
          <div style={{ fontWeight: "600", color: "#666" }}>Line Height</div>

          {/* Data rows */}
          {levels.map((level) => {
            const token = textTokens[level as keyof typeof textTokens];
            return (
              <React.Fragment key={level}>
                <div style={{ fontWeight: "600", color: "#333" }}>{level}</div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#0066cc",
                  }}
                >
                  {token.size.$value}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#0066cc",
                  }}
                >
                  {token.weight.$value}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#0066cc",
                  }}
                >
                  {token.leading.$value}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#0066cc",
                  }}
                >
                  {token.lineHeight.$value}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Visual Preview */}
        <h2 style={{ marginBottom: "1rem", color: "var(--shade-foreground)" }}>
          Typography Preview
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {levels.map((level) => {
            const token = textTokens[level as keyof typeof textTokens];
            return (
              <div
                key={level}
                style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}
              >
                <div
                  style={{
                    minWidth: "2rem",
                    fontSize: "0.875rem",
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  {level}
                </div>
                <div
                  style={{
                    fontSize: token.size.$value,
                    fontWeight: token.weight.$value,
                    lineHeight: token.lineHeight.$value,
                    letterSpacing: token.leading.$value,
                    color: "var(--shade-foreground)",
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};
