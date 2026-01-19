import type { Meta, StoryObj } from "@storybook/react-vite";
import { BackgroundAurora } from "@uiid/backgrounds";

// Color constants
const COLOR_ELECTRIC_BLUE = "#6AF3FF";
const COLOR_SEA = "#005D8C";
const COLOR_MIDNIGHT = "#002F46";
const COLOR_ORCHID = "#D982FF";
const COLOR_LAVENDER = "#9EA3FF";
const COLOR_TURQUOISE = "#66EEC1";
const COLOR_FOREST = "#004D52";
const COLOR_SKY = "#60C5D9";
const COLOR_SLATE = "#001E2D";

const meta: Meta<typeof BackgroundAurora> = {
  title: "Backgrounds/Aurora",
  args: {},
  argTypes: {
    colorStops: { control: "object" },
    amplitude: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    blend: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    speed: { control: { type: "range", min: 0.1, max: 5, step: 0.1 } },
  },
  tags: ["new"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <BackgroundAurora {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default",
};

export const Electric: Story = {
  name: "Electric",
  args: { colorStops: [COLOR_ELECTRIC_BLUE, COLOR_SKY, COLOR_ELECTRIC_BLUE] },
};

export const Ocean: Story = {
  name: "Ocean",
  args: { colorStops: [COLOR_MIDNIGHT, COLOR_SEA, COLOR_SKY] },
};

export const Twilight: Story = {
  name: "Twilight",
  args: { colorStops: [COLOR_MIDNIGHT, COLOR_LAVENDER, COLOR_ORCHID] },
};

export const Forest: Story = {
  name: "Forest",
  args: { colorStops: [COLOR_FOREST, COLOR_TURQUOISE, COLOR_FOREST] },
};

export const Neon: Story = {
  name: "Neon",
  args: { colorStops: [COLOR_ORCHID, COLOR_ELECTRIC_BLUE, COLOR_TURQUOISE] },
};

export const DeepSea: Story = {
  name: "Deep Sea",
  args: { colorStops: [COLOR_SLATE, COLOR_SEA, COLOR_TURQUOISE] },
};

export const Sunset: Story = {
  name: "Sunset",
  args: { colorStops: [COLOR_ORCHID, COLOR_LAVENDER, COLOR_SKY] },
};

export const Calm: Story = {
  name: "Calm",
  args: {
    colorStops: [COLOR_MIDNIGHT, COLOR_SKY, COLOR_MIDNIGHT],
    amplitude: 0.5,
    speed: 0.5,
  },
};

export const Intense: Story = {
  name: "Intense",
  args: {
    colorStops: [COLOR_ELECTRIC_BLUE, COLOR_ORCHID, COLOR_TURQUOISE],
    amplitude: 2.0,
    speed: 2.0,
    blend: 0.8,
  },
};
