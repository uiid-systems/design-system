import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Interactive/Slider",
  component: Slider,
  args: {},
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Slider {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Slider" };
