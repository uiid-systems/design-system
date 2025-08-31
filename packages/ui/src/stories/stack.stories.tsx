import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Stack } from "../components/layout";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  args: { gap: 2 },
  render: (args) => (
    <Stack {...args}>
      <Boxes />
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Stack" };

const Boxes = () => (
  <>
    <Box style={{ background: "tomato", height: 64, width: 64 }} />
    <Box style={{ background: "gold", height: 64, width: 64 }} />
    <Box style={{ background: "mediumseagreen", height: 64, width: 64 }} />
  </>
);
