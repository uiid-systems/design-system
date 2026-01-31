import type { StoryObj } from "@storybook/react-vite";

import spacingTokens from "../json/primitives/spacing.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens } from "./utilities";

const meta = {
  title: "Tokens/Primitives/Spacing",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: () => {
    const spacing = spacingTokens.spacing;
    const allTokens = flattenTokens(spacing, ["spacing"]);

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <SectionHeader>Spacing Properties</SectionHeader>
        <TokenTable tokens={allTokens} />
      </div>
    );
  },
};
