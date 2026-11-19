import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@uiid/design-system";

import * as Examples from "../../../../packages/overlays/src/tooltip/tooltip.examples";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    children: "This is a tooltip",
    trigger: <Button>Hover me</Button>,
  },
  argTypes: {
    trigger: { table: { disable: true } },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Positioning: Story = { render: () => <Examples.Positioning /> };

export const Delay: Story = { render: () => <Examples.Delay /> };

export const Triggers: Story = { render: () => <Examples.Triggers /> };
