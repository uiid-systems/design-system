import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Drawer } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons/globe";

import * as Examples from "../../../../packages/overlays/src/drawer/drawer.examples";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    title: "Drawer Title",
    description: "Drawer Description",
    icon: GlobeIcon,
    action: <Button size="xsmall">Action</Button>,
    footer: "Drawer Footer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {
    swipeDirection: {
      control: "select",
      options: ["up", "down", "left", "right"],
      table: { category: "Behavior" },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Drawer {...args} trigger={<Button>Open drawer</Button>} />,
};

/** Swipe or drag the drawer toward its anchored edge to dismiss it. */
export const SwipeDirections: Story = {
  render: () => <Examples.SwipeDirections />,
};

/** Snap points let the drawer rest partway open before expanding. */
export const SnapPoints: Story = { render: () => <Examples.SnapPoints /> };

export const NonModal: Story = { render: () => <Examples.NonModal /> };

export const HeaderVariants: Story = {
  render: () => <Examples.HeaderVariants />,
};

export const Footer: Story = { render: () => <Examples.Footer /> };
