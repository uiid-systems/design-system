import type { StoryObj } from "@storybook/react-vite";

import overlaysTokens from "../json/overlays.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens } from "./utilities";

const meta = {
  title: "Tokens/Components/Overlays",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overlays: Story = {
  render: () => {
    const overlays = overlaysTokens.overlays;
    const allTokens = flattenTokens(overlays, ["overlays"]);

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <SectionHeader>Overlay Properties</SectionHeader>
        <TokenTable tokens={allTokens} />
      </div>
    );
  },
};
