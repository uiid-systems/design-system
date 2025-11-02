import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./box";

const meta = {
  title: "Layout/Utilities/Box",
  component: Box,
  args: {},
  render: (args) => (
    <Box
      {...args}
      render={<aside style={{ opacity: 0.5 }} className="foo" />}
      className="bar"
      fullwidth
      ml={2}
      ax="center"
      ay="center"
      style={{
        background: "tomato",
        minWidth: 64,
        height: 64,
      }}
    />
  ),
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Box" };
