import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  args: {
    title: "This is a modal",
    showCloseButton: true,
    children:
      "A modal is a temporary window that appears on top of the current page. It is used to display content that is not part of the main page, such as a login form or a popup.",
  },
  argTypes: {},
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
