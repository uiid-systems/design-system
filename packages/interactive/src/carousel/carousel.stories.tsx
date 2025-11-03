import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChevronLeft, ChevronRight } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { Carousel } from "./carousel";

const slides = [
  { id: "1", render: <div>Slide 1</div> },
  { id: "2", render: <div>Slide 2</div> },
  { id: "3", render: <div>Slide 3</div> },
];

const meta: Meta<typeof Carousel> = {
  title: "Interactive/Carousel",
  component: Carousel,
  args: {
    slides,
    previousButton: {
      render: <ChevronLeft size={24} />,
      onClick: () => console.log("Previous"),
    },
    nextButton: {
      render: <ChevronRight size={24} />,
      onClick: () => console.log("Next"),
    },
  },
  argTypes: {},
  render: (args) => (
    <Stack fullwidth ax="stretch" gap={4}>
      <Carousel {...args} />
      <Carousel {...args} orientation="vertical" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Carousel" };
