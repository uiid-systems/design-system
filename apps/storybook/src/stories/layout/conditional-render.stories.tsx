import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConditionalRender } from "@uiid/layout";

const meta = {
  title: "Layout/Utilities/Conditional Render",
  component: ConditionalRender,
  args: {
    condition: true,
    render: <div style={{ background: "gold", height: 64, width: 64 }} />,
  },
  argTypes: {
    condition: { type: "boolean" },
    children: { table: { disable: true } },
    render: { table: { disable: true } },
  },
  render: (args) => <ConditionalRender {...args} />,
} satisfies Meta<typeof ConditionalRender>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Conditional Render" };
