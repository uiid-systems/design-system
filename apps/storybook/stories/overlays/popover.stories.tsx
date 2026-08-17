import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Popover } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons/globe";

import * as Examples from "../../../../packages/overlays/src/popover/popover.examples";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    title: "Popover Title",
    description: "Popover Description",
    icon: GlobeIcon,
    action: <Button size="xsmall">Action</Button>,
    footer: "Popover Footer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover {...args} trigger={<Button>Open popover</Button>} />
  ),
};

export const Positioning: Story = { render: () => <Examples.Positioning /> };

export const HeaderVariants: Story = {
  render: () => <Examples.HeaderVariants />,
};

export const Footer: Story = { render: () => <Examples.Footer /> };
