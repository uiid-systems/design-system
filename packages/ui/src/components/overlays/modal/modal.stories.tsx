import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Overlays/Modal",
  component: Modal,
  args: {
    trigger: "This is a modal trigger",
    title: "Modal",
    description: "This is a modal",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Modal {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Modal" };
