import { Box, Text } from "@uiid/design-system";
import { cx } from "@uiid/design-system/utils";

import styles from "./TokenVisual.module.css";

interface TokenVisualProps {
  token: {
    name: string;
    /** A literal, or a `{group.token}` reference. Token JSON can hold a bare number (`400`). */
    value: string | number;
    type: string;
  };
}

// Helper to convert token references to CSS variables
// e.g., "{color.blue}" -> "var(--color-blue)"
const toCssVariable = (value: string | number): string => {
  const text = String(value);
  if (text.startsWith("{") && text.endsWith("}")) {
    const path = text.slice(1, -1).replace(/\./g, "-");
    return `var(--${path})`;
  }
  return text;
};

/*
 * The token's value is the one thing a class cannot know, so it travels as a
 * single custom property and the CSS module decides how to paint it.
 */
const tokenValueStyle = (value: string | number) =>
  ({ "--token-value": toCssVariable(value) }) as React.CSSProperties;

// Visual representation based on token type
export const TokenVisual = ({ token }: TokenVisualProps) => {
  const name = token.name.toLowerCase();

  if (token.type === "color") {
    return (
      <Box
        w={120}
        h={32}
        b={1}
        className={styles.swatch}
        style={tokenValueStyle(token.value)}
      />
    );
  }

  if (token.type === "dimension") {
    if (name.includes("radius")) {
      return (
        <Box
          w={60}
          h={32}
          b={1}
          className={styles.radius}
          style={tokenValueStyle(token.value)}
        />
      );
    }
    if (name.includes("font") && name.includes("size")) {
      return (
        <Text
          className={styles["font-size"]}
          style={tokenValueStyle(token.value)}
        >
          Aa
        </Text>
      );
    }
    // For padding or other dimensions, show a bar along the axis it names
    return (
      <Box
        className={cx(
          styles.bar,
          name.includes("x") && styles["bar-x"],
          name.includes("y") && styles["bar-y"],
        )}
        style={tokenValueStyle(token.value)}
      />
    );
  }

  if (token.type === "fontWeight") {
    return (
      <Text
        className={styles["font-weight"]}
        style={tokenValueStyle(token.value)}
      >
        Sample Text
      </Text>
    );
  }

  if (token.type === "number" || token.type === "duration") {
    return (
      <Text family="mono" size={-1} emphasis="muted">
        {String(token.value)}
      </Text>
    );
  }

  return <Text emphasis="muted">—</Text>;
};
