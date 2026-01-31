import type { StoryObj } from "@storybook/react-vite";

import inputTokens from "../json/semantic/forms.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens, filterByPathIncludes } from "./utilities";

const meta = {
  title: "Tokens/Components/Input",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Input: Story = {
  render: () => {
    const input = inputTokens.forms;
    const allTokens = flattenTokens(input, ["input"]);

    // Extract required properties
    const requiredProps = filterByPathIncludes(allTokens, "required");

    // Extract label properties
    const labelProps = filterByPathIncludes(allTokens, "label");

    // Extract description properties
    const descriptionProps = filterByPathIncludes(allTokens, "description");

    // Extract hint properties
    const hintProps = filterByPathIncludes(allTokens, "hint");

    // Extract placeholder properties
    const placeholderProps = filterByPathIncludes(allTokens, "placeholder");

    // Extract bookend properties
    const bookendProps = filterByPathIncludes(allTokens, "bookend");

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Required Properties */}
        <SectionHeader>Required</SectionHeader>
        <TokenTable tokens={requiredProps} />

        {/* Label Properties */}
        <SectionHeader>Label</SectionHeader>
        <TokenTable tokens={labelProps} />

        {/* Description Properties */}
        <SectionHeader>Description</SectionHeader>
        <TokenTable tokens={descriptionProps} />

        {/* Hint Properties */}
        <SectionHeader>Hint</SectionHeader>
        <TokenTable tokens={hintProps} />

        {/* Placeholder Properties */}
        <SectionHeader>Placeholder</SectionHeader>
        <TokenTable tokens={placeholderProps} />

        {/* Bookend Properties */}
        <SectionHeader>Bookend</SectionHeader>
        <TokenTable tokens={bookendProps} />
      </div>
    );
  },
};
