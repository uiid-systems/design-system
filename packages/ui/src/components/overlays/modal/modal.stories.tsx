import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Overlays/Modal",
  component: Modal,
  args: {
    children: "This is a modal",
    title: "Modal",
    description: "This is a modal",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Modal {...args}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa
        hic, accusamus dolor cum minima pariatur provident vero blanditiis vel!
        Assumenda ipsum officia autem!
      </Modal>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Modal" };
