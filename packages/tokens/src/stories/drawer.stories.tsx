import type { StoryObj } from "@storybook/react-vite";

import drawerTokens from "../json/component/drawer.tokens.json";
import { TokenTable, SectionHeader } from "./subcomponents";
import { flattenTokens } from "./utilities";

const meta = {
  title: "Tokens/Components/Drawer",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawer: Story = {
  render: () => {
    const drawer = drawerTokens.drawer;
    const allTokens = flattenTokens(drawer, ["drawer"]);

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <SectionHeader>Drawer Properties</SectionHeader>
        <TokenTable tokens={allTokens} />
      </div>
    );
  },
};
