import type { StoryObj } from "@storybook/react-vite";

import formsTokens from "../json/forms.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import {
  flattenTokens,
  filterTopLevel,
  filterByPathIncludes,
  capitalize,
} from "./utilities";

const meta = {
  title: "Tokens/Components/Forms",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Forms: Story = {
  render: () => {
    const forms = formsTokens.forms;
    const allTokens = flattenTokens(forms, ["forms"]);

    // Extract basic properties (top-level tokens, excluding nested groups)
    const basicProps = filterTopLevel(allTokens, 2, [
      "border",
      "outline",
      "placeholder",
      "size",
      "state",
    ]);

    // Extract border properties
    const borderProps = filterByPathIncludes(allTokens, "border");

    // Extract outline properties
    const outlineProps = filterByPathIncludes(allTokens, "outline");

    // Extract placeholder properties
    const placeholderProps = filterByPathIncludes(allTokens, "placeholder");

    // Extract size variants
    const sizeTokens = filterByPathIncludes(allTokens, "size").map((token) => ({
      ...token,
      name: token.path
        .slice(2) // Remove "forms" and "size"
        .map((part, idx) =>
          idx === 0 ? `Size ${part.toUpperCase()}` : ` - ${capitalize(part)}`,
        )
        .join(""),
    }));

    // Extract state variants
    const stateTokens = filterByPathIncludes(allTokens, "state").map(
      (token) => ({
        ...token,
        name: token.path
          .slice(2) // Remove "forms" and "state"
          .map((part, idx) =>
            idx === 0 ? capitalize(part) : ` - ${capitalize(part)}`,
          )
          .join(""),
      }),
    );

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Basic Properties */}
        <SectionHeader>Form Properties</SectionHeader>
        <TokenTable tokens={basicProps} />

        {/* Border Properties */}
        <SectionHeader>Border</SectionHeader>
        <TokenTable tokens={borderProps} />

        {/* Outline Properties */}
        <SectionHeader>Outline</SectionHeader>
        <TokenTable tokens={outlineProps} />

        {/* Placeholder Properties */}
        <SectionHeader>Placeholder</SectionHeader>
        <TokenTable tokens={placeholderProps} />

        {/* Size Variants */}
        <SectionHeader>Size Variants</SectionHeader>
        <TokenTable tokens={sizeTokens} />

        {/* State Variants */}
        <SectionHeader>State Variants</SectionHeader>
        <TokenTable tokens={stateTokens} />
      </div>
    );
  },
};
