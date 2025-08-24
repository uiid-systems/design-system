import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Stack, Slots } from "../components/layout";

const meta = {
  title: "Layout/Slots",
  component: Slots,
  args: {
    before: <Box style={{ background: "tomato", height: 64, width: 64 }} />,
    after: (
      <Box style={{ background: "mediumseagreen", height: 64, width: 64 }} />
    ),
  },
  render: (args) => (
    <Stack gap={2}>
      <Slots {...args}>
        <Box style={{ background: "gold", height: 64, width: 64 }} />
      </Slots>
      <Slots {...args} direction="column">
        <Box style={{ background: "gold", height: 64, width: 64 }} />
      </Slots>
      <Slots {...args} before={undefined}>
        <Box style={{ background: "gold", height: 64, width: 64 }} />
      </Slots>
      <Slots {...args} after={undefined}>
        <Box style={{ background: "gold", height: 64, width: 64 }} />
      </Slots>
      <Slots {...args} before={undefined} after={undefined}>
        <Box style={{ background: "gold", height: 64, width: 64 }} />
      </Slots>
    </Stack>
  ),
} satisfies Meta<typeof Slots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Slots" };
