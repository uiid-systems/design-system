import type { StoryObj } from "@storybook/react-vite";

import badgeTokens from "../json/component/badge.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import {
  flattenTokens,
  filterByPathExcludes,
  filterByPathIncludes,
  capitalize,
} from "./utilities";

const meta = {
  title: "Tokens/Components/Badge",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Badge: Story = {
  render: () => {
    const badge = badgeTokens.badge;
    const allTokens = flattenTokens(badge, ["badge"]);

    // Separate basic properties from colors
    const basicProps = filterByPathExcludes(allTokens, ["color"]);

    const colorTokensList = filterByPathIncludes(allTokens, "color").map(
      (token) => ({
        ...token,
        name: token.path
          .slice(2) // Remove "badge" and "color"
          .map(capitalize)
          .join(" ")
          .replace("Shade", "")
          .toUpperCase(),
      }),
    );

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Basic Properties Table */}
        <SectionHeader>Badge Properties</SectionHeader>
        <TokenTable tokens={basicProps} />

        {/* Color Tokens Table */}
        <SectionHeader>Badge Colors</SectionHeader>
        <TokenTable tokens={colorTokensList} />
      </div>
    );
  },
};
