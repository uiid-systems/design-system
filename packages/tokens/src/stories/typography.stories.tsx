import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import typographyTokens from "../json/primitives/typography.tokens.json";

// Extract text levels and properties from tokens
const TEXT_LEVELS = Object.keys(typographyTokens.typography.text)
  .map(Number)
  .sort((a, b) => a - b);
const TEXT_PROPERTIES = ["size", "weight", "leading", "lineHeight"];

const meta = {
  title: "Tokens/Typography",
};

export default meta;
type Story = StoryObj<typeof meta>;

// Transform token structure to flat typography data
const TYPOGRAPHY_DATA = Object.entries(typographyTokens.typography.text).reduce(
  (acc, [level, properties]) => {
    acc[Number(level)] = Object.entries(
      properties as Record<string, { $value: string }>,
    ).reduce(
      (propAcc, [prop, token]) => {
        if (prop.startsWith("$")) return propAcc; // Skip metadata
        propAcc[prop] = token.$value;
        return propAcc;
      },
      {} as Record<string, string>,
    );
    return acc;
  },
  {} as Record<number, Record<string, string>>,
);

export const Typography: Story = {
  render: ({}) => {
    return (
      <div style={{ maxWidth: "1200px", padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gap: "2rem",
          }}
        >
          {TEXT_LEVELS.map((level) => {
            const values = TYPOGRAPHY_DATA[level] || {};
            const sampleTexts = [
              "Typography is the art and technique of arranging type",
              "The quick brown fox jumps over the lazy dog",
              "Good design is as little design as possible",
              "Simplicity is the ultimate sophistication",
              "Design is thinking made visual",
              "Form follows function",
              "Clarity above all",
              "Less is more",
              "Beautiful",
            ];

            return (
              <Typespecimen
                key={level}
                level={level}
                values={values}
                sampleText={sampleTexts[level] || sampleTexts[0]}
              />
            );
          })}
        </div>

        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "1px solid #e9ecef",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#1a1a1a",
            }}
          >
            Token Reference
          </h3>
          <TokenTable levels={TEXT_LEVELS} typographyData={TYPOGRAPHY_DATA} />
        </div>
      </div>
    );
  },
};

const Typespecimen = ({
  level,
  values,
  sampleText,
}: {
  level: number;
  values: Record<string, string>;
  sampleText: string;
}) => {
  const cssVars = {
    fontSize: values.size || "1rem",
    fontWeight: values.weight || "400",
    lineHeight: values.lineHeight || "150%",
    letterSpacing: values.leading || "0%",
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e9ecef",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #f1f3f4",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#e3f2fd",
              color: "#1565c0",
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Level {level}
          </span>
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#666",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          --typography-text-{level}-*
        </div>
      </div>

      <div
        style={{
          ...cssVars,
          marginBottom: "1.5rem",
          color: "#1a1a1a",
        }}
      >
        {sampleText}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          fontSize: "0.75rem",
          color: "#666",
        }}
      >
        <PropertyValue label="Size" value={values.size} />
        <PropertyValue label="Weight" value={values.weight} />
        <PropertyValue label="Line Height" value={values.lineHeight} />
        <PropertyValue label="Letter Spacing" value={values.leading} />
      </div>
    </div>
  );
};

const PropertyValue = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{label}</div>
    <div style={{ fontFamily: "ui-monospace, monospace" }}>
      {value || "N/A"}
    </div>
  </div>
);

const TokenTable = ({
  levels,
  typographyData,
}: {
  levels: number[];
  typographyData: Record<number, Record<string, string>>;
}) => (
  <div
    style={{
      overflowX: "auto",
    }}
  >
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.875rem",
      }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #dee2e6" }}>
          <th
            style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600 }}
          >
            Level
          </th>
          {TEXT_PROPERTIES.map((prop) => (
            <th
              key={prop}
              style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600 }}
            >
              {prop.charAt(0).toUpperCase() + prop.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {levels.map((level) => {
          const values = typographyData[level] || {};
          return (
            <tr key={level} style={{ borderBottom: "1px solid #e9ecef" }}>
              <td
                style={{
                  padding: "0.75rem",
                  fontFamily: "ui-monospace, monospace",
                  fontWeight: 600,
                  color: "#1565c0",
                }}
              >
                {level}
              </td>
              {TEXT_PROPERTIES.map((prop) => (
                <td
                  key={prop}
                  style={{
                    padding: "0.75rem",
                    fontFamily: "ui-monospace, monospace",
                    color: "#666",
                  }}
                >
                  {values[prop] || "N/A"}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
