import type { Meta, StoryObj } from "@storybook/react-vite";
import { BackgroundLiquidChrome } from "@uiid/backgrounds";

// Color constants
const COLOR_ELECTRIC_BLUE = "#6AF3FF";
const COLOR_SEA = "#005D8C";
const COLOR_MIDNIGHT = "#002F46";
const COLOR_ORCHID = "#D982FF";
const COLOR_LAVENDER = "#9EA3FF";
const COLOR_TURQUOISE = "#66EEC1";
const COLOR_FOREST = "#004D52";
const COLOR_SKY = "#60C5D9";

const meta: Meta<typeof BackgroundLiquidChrome> = {
  title: "backgrounds/Liquid Chrome",
  tags: ["new"],
  args: {},
  argTypes: {},
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <BackgroundLiquidChrome {...args} />
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
  args: { baseColor: COLOR_ELECTRIC_BLUE, secondaryColor: COLOR_SEA },
};

export const Ocean: Story = {
  name: "Ocean",
  args: { baseColor: COLOR_SKY, secondaryColor: COLOR_MIDNIGHT },
};

export const Aurora: Story = {
  name: "Aurora",
  args: { baseColor: COLOR_LAVENDER, secondaryColor: COLOR_ORCHID },
};

export const Forest: Story = {
  name: "Forest",
  args: { baseColor: COLOR_TURQUOISE, secondaryColor: COLOR_FOREST },
};

export const Neon: Story = {
  name: "Neon",
  args: { baseColor: COLOR_ORCHID, secondaryColor: COLOR_ELECTRIC_BLUE },
};
