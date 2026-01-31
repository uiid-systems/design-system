import type { StoryObj } from "@storybook/react-vite";

import popoverTokens from "../json/component/popover.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens } from "./utilities";

const meta = {
  title: "Tokens/Components/Popover",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Popover: Story = {
  render: () => {
    const popover = popoverTokens.popover;
    const allTokens = flattenTokens(popover, ["popover"]);

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <SectionHeader>Popover Properties</SectionHeader>
        <TokenTable tokens={allTokens} />
      </div>
    );
  },
};
