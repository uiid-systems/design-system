import type { Meta, StoryObj } from "@storybook/react-vite";

import { List } from "@uiid/design-system";

import * as Examples from "../../../../packages/lists/src/list/list.examples";

const meta = {
  title: "Lists/List",
  component: List,
  tags: ["beta"],
  argTypes: {
    marker: {
      control: "select",
      options: ["none", "disc", "decimal", "square"],
      table: { category: "Variants" },
    },
    line: { control: "boolean", table: { category: "Toggles" } },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: () => <Examples.Default /> };
export const WithIcons: Story = { render: () => <Examples.WithIcons /> };
export const WithDescriptions: Story = {
  render: () => <Examples.WithDescriptions />,
};
export const NestedGroups: Story = { render: () => <Examples.NestedGroups /> };
export const Markers: Story = { render: () => <Examples.Markers /> };
export const Composable: Story = { render: () => <Examples.Composable /> };
