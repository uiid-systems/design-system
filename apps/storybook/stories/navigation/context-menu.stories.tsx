import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenuRoot } from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/context-menu/context-menu.examples";

/* The parts only: the simple `ContextMenu` that takes `items` comes later.
   Right-click (or long-press) a card to open its menu at the pointer. */
const meta: Meta<typeof ContextMenuRoot> = {
  title: "Navigation/ContextMenu",
  component: ContextMenuRoot,
  tags: ["beta"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  name: "Composed from parts",
  render: () => <Examples.Composed />,
};

export const RenderedTrigger: Story = {
  render: () => <Examples.RenderedTrigger />,
};

export const Disabled: Story = { render: () => <Examples.Disabled /> };
