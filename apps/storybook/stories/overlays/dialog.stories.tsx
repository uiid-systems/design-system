import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons/globe";

import * as Examples from "../../../../packages/overlays/src/dialog/dialog.examples";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  args: {
    title: "Dialog Title",
    description: "Dialog Description",
    icon: GlobeIcon,
    action: <Button size="xsmall">Action</Button>,
    footer: "Footer",
    children:
      "A modal is a temporary window that appears on top of the current page. It is used to display content that is not part of the main page, such as a login form or a popup.",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "xlarge"],
      table: { category: "Variants" },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Dialog {...args} trigger={<Button>Open dialog</Button>} />,
};

export const Sizes: Story = { render: () => <Examples.Sizes /> };

export const HeaderVariants: Story = {
  render: () => <Examples.HeaderVariants />,
};

export const Footer: Story = { render: () => <Examples.Footer /> };

export const Triggers: Story = { render: () => <Examples.Triggers /> };
