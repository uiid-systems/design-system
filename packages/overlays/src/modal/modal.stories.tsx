import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobeIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["beta"],
  args: {
    title: "Modal Title",
    description: "Modal Description",
    icon: GlobeIcon,
    action: <button>Action</button>,
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
  render: (args) => (
    <Stack gap={4}>
      <Modal {...args} trigger={<button>button</button>} />
      <Modal {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Modal" };
