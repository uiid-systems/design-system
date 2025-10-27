import type { StoryObj } from "@storybook/react-vite";

import globalsTokens from "../json/globals.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens, filterByPathIncludes } from "./utilities";

const meta = {
  title: "Tokens/Primitives/Globals",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Globals: Story = {
  render: () => {
    const globals = globalsTokens.globals;
    const allTokens = flattenTokens(globals, ["globals"]);

    // Extract transition properties
    const transitionProps = filterByPathIncludes(allTokens, "transition");

    // Extract transform properties
    const transformProps = filterByPathIncludes(allTokens, "transform");

    // Extract border properties
    const borderProps = filterByPathIncludes(allTokens, "border");

    // Extract padding properties
    const paddingProps = filterByPathIncludes(allTokens, "padding");

    // Extract outline properties
    const outlineProps = filterByPathIncludes(allTokens, "outline");

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Transition Properties */}
        <SectionHeader>Transition</SectionHeader>
        <TokenTable tokens={transitionProps} />

        {/* Transform Properties */}
        <SectionHeader>Transform</SectionHeader>
        <TokenTable tokens={transformProps} />

        {/* Border Properties */}
        <SectionHeader>Border</SectionHeader>
        <TokenTable tokens={borderProps} />

        {/* Padding Properties */}
        <SectionHeader>Padding</SectionHeader>
        <TokenTable tokens={paddingProps} />

        {/* Outline Properties */}
        <SectionHeader>Outline</SectionHeader>
        <TokenTable tokens={outlineProps} />
      </div>
    );
  },
};
