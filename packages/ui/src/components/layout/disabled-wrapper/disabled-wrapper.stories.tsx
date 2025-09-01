import type { Meta, StoryObj } from "@storybook/react-vite";
import { DisabledWrapper } from "./disabled-wrapper";

const meta = {
  title: "Layout/DisabledWrapper",
  component: DisabledWrapper,
  args: {
    disabled: true,
    children: <div style={{ background: "gold", height: 64, width: 64 }} />,
  },
  render: (args) => <DisabledWrapper {...args} />,
} satisfies Meta<typeof DisabledWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "DisabledWrapper" };
