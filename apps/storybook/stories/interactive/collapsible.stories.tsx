import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Collapsible, Text } from "@uiid/design-system";

import * as Examples from "../../../../packages/interactive/src/collapsible/collapsible.examples";

const meta = {
  title: "Interactive/Collapsible",
  component: Collapsible,
  tags: ["beta"],
  args: {
    trigger: <Button>Show details</Button>,
    children: <Text>Tucked away until the trigger opens it.</Text>,
  },
  argTypes: {},
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Triggers: Story = { render: () => <Examples.Triggers /> };

export const Layout: Story = { render: () => <Examples.Layout /> };

export const Controlled: Story = { render: () => <Examples.Controlled /> };

export const Composed: Story = { render: () => <Examples.Composed /> };
