import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Dialog } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons/globe";

const meta: Meta<typeof Dialog> = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["beta"],
  args: {
    title: "Dialog Title",
    description: "Dialog Description",
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
      <Dialog {...args} trigger={<button>button</button>} />
      <Dialog {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Dialog" };
