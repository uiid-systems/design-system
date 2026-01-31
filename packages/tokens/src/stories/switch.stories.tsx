import type { StoryObj } from "@storybook/react-vite";

import switchTokens from "../json/component/switch.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens, filterByPathIncludes } from "./utilities";

const meta = {
  title: "Tokens/Components/Switch",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Switch: Story = {
  render: () => {
    const switchToken = switchTokens.switch;
    const allTokens = flattenTokens(switchToken, ["switch"]);

    // Extract color properties
    const colorProps = filterByPathIncludes(allTokens, "color");

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {/* Color Properties */}
        <SectionHeader>Colors</SectionHeader>
        <TokenTable tokens={colorProps} />
      </div>
    );
  },
};
