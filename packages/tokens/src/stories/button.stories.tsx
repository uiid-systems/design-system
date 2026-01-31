import type { StoryObj } from "@storybook/react-vite";

import buttonTokens from "../json/component/button.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import {
  flattenTokens,
  filterTopLevel,
  filterByPathIncludes,
  capitalize,
} from "./utilities";

const meta = {
  title: "Tokens/Components/Button",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  render: () => {
    const button = buttonTokens.button;
    const allTokens = flattenTokens(button, ["button"]);

    // Extract basic properties (top-level tokens, excluding nested groups)
    const basicProps = filterTopLevel(allTokens, 2, [
      "border",
      "scale",
      "size",
      "variant",
    ]);

    // Extract border properties
    const borderProps = filterByPathIncludes(allTokens, "border");

    // Extract scale properties
    const scaleProps = filterByPathIncludes(allTokens, "scale");

    // Extract size variants
    const sizeTokens = filterByPathIncludes(allTokens, "size").map((token) => ({
      ...token,
      name: token.path
        .slice(2) // Remove "button" and "size"
        .map((part, idx) =>
          idx === 0 ? `Size ${part.toUpperCase()}` : ` - ${capitalize(part)}`,
        )
        .join(""),
    }));

    // Extract variant tokens
    const variantTokens = filterByPathIncludes(allTokens, "variant").map(
      (token) => ({
        ...token,
        name: token.path
          .slice(2) // Remove "button" and "variant"
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
        {/* Basic Properties */}
        <SectionHeader>Button Properties</SectionHeader>
        <TokenTable tokens={basicProps} />

        {/* Border Properties */}
        <SectionHeader>Border</SectionHeader>
        <TokenTable tokens={borderProps} />

        {/* Scale Properties */}
        <SectionHeader>Scale</SectionHeader>
        <TokenTable tokens={scaleProps} />

        {/* Size Variants */}
        <SectionHeader>Size Variants</SectionHeader>
        <TokenTable tokens={sizeTokens} />

        {/* Color Variants */}
        <SectionHeader>Color Variants</SectionHeader>
        <TokenTable tokens={variantTokens} />
      </div>
    );
  },
};
