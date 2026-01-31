import type { StoryObj } from "@storybook/react-vite";

import cardTokens from "../json/component/card.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens, filterByPathIncludes, capitalize } from "./utilities";

const meta = {
  title: "Tokens/Components/Card",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  render: () => {
    const card = cardTokens.card;
    const allTokens = flattenTokens(card, ["card"]);

    // Extract color properties
    const colorProps = filterByPathIncludes(allTokens, "color").filter(
      (token) => !token.path.includes("variant"),
    );

    // Extract border properties
    const borderProps = filterByPathIncludes(allTokens, "border").filter(
      (token) => !token.path.includes("variant"),
    );

    // Extract padding properties
    const paddingProps = filterByPathIncludes(allTokens, "padding");

    // Extract icon properties
    const iconProps = filterByPathIncludes(allTokens, "icon");

    // Extract scale properties
    const scaleProps = filterByPathIncludes(allTokens, "scale").filter(
      (token) => !token.path.includes("icon"),
    );

    // Extract variant tokens
    const variantTokens = filterByPathIncludes(allTokens, "variant").map(
      (token) => ({
        ...token,
        name: token.path
          .slice(2) // Remove "card" and "variant"
          .map((part, idx) =>
            idx === 0
              ? capitalize(part)
              : ` - ${capitalize(part.replace("-", " "))}`,
          )
          .join(""),
      }),
    );

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Color Properties */}
        <SectionHeader>Colors</SectionHeader>
        <TokenTable tokens={colorProps} />

        {/* Border Properties */}
        <SectionHeader>Border</SectionHeader>
        <TokenTable tokens={borderProps} />

        {/* Padding Properties */}
        <SectionHeader>Padding</SectionHeader>
        <TokenTable tokens={paddingProps} />

        {/* Icon Properties */}
        <SectionHeader>Icon</SectionHeader>
        <TokenTable tokens={iconProps} />

        {/* Scale Properties */}
        <SectionHeader>Scale</SectionHeader>
        <TokenTable tokens={scaleProps} />

        {/* Variants */}
        <SectionHeader>Variants</SectionHeader>
        <TokenTable tokens={variantTokens} />
      </div>
    );
  },
};
