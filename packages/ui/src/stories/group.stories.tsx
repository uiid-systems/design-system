import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Group } from "../components/layout";

const meta = {
  title: "Layout/Group",
  component: Group,
  render: (args) => (
    <Group {...args}>
      <Boxes />
    </Group>
  ),
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Group" };

const Boxes = () => (
  <>
    <Box style={{ background: "tomato", height: 64, width: 64 }} />
    <Box style={{ background: "gold", height: 64, width: 64 }} />
    <Box style={{ background: "mediumseagreen", height: 64, width: 64 }} />
  </>
);
