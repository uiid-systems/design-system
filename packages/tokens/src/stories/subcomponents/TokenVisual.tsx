interface TokenVisualProps {
  token: {
    name: string;
    value: string;
    type: string;
  };
}

// Helper to convert token references to CSS variables
// e.g., "{colors.blue.500}" -> "var(--colors-blue-500)"
const toCssVariable = (value: string): string => {
  if (value.startsWith("{") && value.endsWith("}")) {
    const path = value.slice(1, -1).replace(/\./g, "-");
    return `var(--${path})`;
  }
  return value;
};

// Visual representation based on token type
export const TokenVisual = ({ token }: TokenVisualProps) => {
  if (token.type === "color") {
    return (
      <div
        style={{
          width: "100%",
          height: "32px",
          backgroundColor: toCssVariable(token.value),
          border: "1px solid #e5e5e5",
          borderRadius: "4px",
        }}
      />
    );
  }

  if (token.type === "dimension") {
    if (token.name.toLowerCase().includes("radius")) {
      return (
        <div
          style={{
            width: "60px",
            height: "32px",
            backgroundColor: "#e5e5e5",
            borderRadius: token.value,
            border: "1px solid #ccc",
          }}
        />
      );
    }
    if (
      token.name.toLowerCase().includes("font") &&
      token.name.toLowerCase().includes("size")
    ) {
      return <span style={{ fontSize: token.value, color: "#333" }}>Aa</span>;
    }
    // For padding or other dimensions, show a box
    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor: "#0066cc",
          height: token.name.toLowerCase().includes("y") ? token.value : "8px",
          width: token.name.toLowerCase().includes("x") ? token.value : "8px",
        }}
      />
    );
  }

  if (token.type === "fontWeight") {
    return (
      <span style={{ fontWeight: token.value, color: "#333" }}>
        Sample Text
      </span>
    );
  }

  if (token.type === "number") {
    return (
      <span
        style={{ fontFamily: "monospace", color: "#666", fontSize: "0.875rem" }}
      >
        {token.value}
      </span>
    );
  }

  if (token.type === "duration") {
    return (
      <span
        style={{ fontFamily: "monospace", color: "#666", fontSize: "0.875rem" }}
      >
        {token.value}
      </span>
    );
  }

  return <span style={{ color: "#999" }}>—</span>;
};
