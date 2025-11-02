import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Carousel } from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "Interactive/Carousel",
  component: Carousel,
  argTypes: {},
  render: (args) => (
    <Stack fullwidth ax="stretch" gap={4}>
      <Carousel />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Carousel" };
