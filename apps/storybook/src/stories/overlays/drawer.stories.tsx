import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Drawer } from "@uiid/overlays";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  /**
   * Vaul is currently abandoned. Also uses Radix instead of Base UI.
   * @see https://github.com/emilkowalski/vaul/blob/main/README.md
   */
  tags: ["deprecated"],
  args: {
    title: "Drawer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Drawer {...args} trigger={<button>button</button>} />
      <Drawer {...args} trigger="string" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Drawer" };
