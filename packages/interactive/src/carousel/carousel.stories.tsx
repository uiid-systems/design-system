import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { Carousel } from "./carousel";
import type { CarouselComponentProps } from "./carousel.types";

const Slide = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        height: "5rem",
        aspectRatio: 1,
        backgroundColor: "var(--shade-foreground)",
        color: "var(--shade-background)",
        borderRadius: "var(--globals-border-radius)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

const slides: CarouselComponentProps["slides"] = [
  { id: "1", render: <Slide>Slide 1</Slide> },
  { id: "2", render: <Slide>Slide 2</Slide> },
  { id: "3", render: <Slide>Slide 3</Slide> },
  { id: "4", render: <Slide>Slide 4</Slide> },
  { id: "5", render: <Slide>Slide 5</Slide> },
  { id: "6", render: <Slide>Slide 6</Slide> },
];

const meta: Meta<typeof Carousel> = {
  title: "Interactive/Carousel",
  component: Carousel,
  tags: ["danger"],
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
      <Carousel {...args} size="5rem" />
      <Carousel {...args} orientation="vertical" />
      <Carousel
        {...args}
        orientation="vertical"
        size="5rem"
        align="center"
        gap={1}
        nextButton={{ render: <ChevronDown size={24} /> }}
        previousButton={{ render: <ChevronUp size={24} /> }}
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Carousel" };
