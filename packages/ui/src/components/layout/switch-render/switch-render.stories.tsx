import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchRender } from "../";

const meta = {
  title: "Primitives/Layout/Switch Render",
  component: SwitchRender,
  args: {
    condition: true,
    wrappers: {
      true: (
        <div style={{ background: "mediumseagreen", height: 64, width: 64 }} />
      ),
      false: <div style={{ background: "tomato", height: 64, width: 64 }} />,
    },
  },
  argTypes: {
    condition: { type: "boolean" },
    children: { table: { disable: true } },
    wrappers: { table: { disable: true } },
  },
  render: (args) => <SwitchRender {...args} />,
} satisfies Meta<typeof SwitchRender>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Switch Render" };
