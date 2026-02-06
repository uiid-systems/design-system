import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./box";

const meta = {
  title: "Layout/Utilities/Box",
  component: Box,
  parameters: {
    layout: "fullscreen",
  },
  args: {},
  render: (args) => (
    <Box
      {...args}
      render={<aside style={{ opacity: 0.5 }} className="foo" />}
      className="bar"
      ax="center"
      ay="center"
      maxw={244 * 2}
      fullwidth
      h={80}
      style={{ background: "tomato" }}
    />
  ),
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Box" };
