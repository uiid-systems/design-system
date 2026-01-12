import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  COLOR_ELECTRIC_BLUE,
  COLOR_SEA,
  COLOR_MIDNIGHT,
  COLOR_ORCHID,
  COLOR_LAVENDER,
  COLOR_TURQUOISE,
  COLOR_FOREST,
  COLOR_SKY,
  COLOR_SLATE,
} from "../backgrounds.constants";
import { BackgroundGradientBlinds } from "./gradient-blinds";

const meta: Meta<typeof BackgroundGradientBlinds> = {
  title: "Backgrounds/Gradient Blinds",
  component: BackgroundGradientBlinds,
  args: {},
  argTypes: {
    gradientColors: { control: "object" },
    angle: { control: { type: "range", min: 0, max: 360, step: 1 } },
    noise: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    blindCount: { control: { type: "range", min: 1, max: 32, step: 1 } },
    blindMinWidth: { control: { type: "range", min: 20, max: 200, step: 10 } },
    mouseDampening: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    mirrorGradient: { control: "boolean" },
    spotlightRadius: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    spotlightSoftness: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
    },
    spotlightOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    distortAmount: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    shineDirection: { control: "select", options: ["left", "right"] },
    paused: { control: "boolean" },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <BackgroundGradientBlinds {...args} />
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
  args: {
    gradientColors: [COLOR_ELECTRIC_BLUE, COLOR_SKY, COLOR_MIDNIGHT],
  },
};

export const Ocean: Story = {
  name: "Ocean",
  args: {
    gradientColors: [COLOR_MIDNIGHT, COLOR_SEA, COLOR_SKY, COLOR_TURQUOISE],
  },
};

export const Twilight: Story = {
  name: "Twilight",
  args: {
    gradientColors: [COLOR_MIDNIGHT, COLOR_LAVENDER, COLOR_ORCHID],
  },
};

export const Forest: Story = {
  name: "Forest",
  args: {
    gradientColors: [COLOR_FOREST, COLOR_TURQUOISE, COLOR_SEA],
  },
};

export const Neon: Story = {
  name: "Neon",
  args: {
    gradientColors: [COLOR_ORCHID, COLOR_ELECTRIC_BLUE, COLOR_TURQUOISE],
    spotlightOpacity: 0.8,
  },
};

export const DeepSea: Story = {
  name: "Deep Sea",
  args: {
    gradientColors: [COLOR_SLATE, COLOR_SEA, COLOR_TURQUOISE, COLOR_SKY],
    mirrorGradient: true,
  },
};

export const Sunset: Story = {
  name: "Sunset",
  args: {
    gradientColors: [COLOR_ORCHID, COLOR_LAVENDER, COLOR_SKY],
    shineDirection: "right",
  },
};

export const Minimal: Story = {
  name: "Minimal",
  args: {
    gradientColors: [COLOR_SLATE, COLOR_MIDNIGHT],
    blindCount: 6,
    noise: 0.1,
  },
};

export const Intense: Story = {
  name: "Intense",
  args: {
    gradientColors: [
      COLOR_ELECTRIC_BLUE,
      COLOR_ORCHID,
      COLOR_TURQUOISE,
      COLOR_LAVENDER,
    ],
    distortAmount: 0.3,
    spotlightRadius: 0.8,
    mirrorGradient: true,
  },
};

export const Angled: Story = {
  name: "Angled",
  args: {
    gradientColors: ["#ff0a0a", "#5227ff"],
    angle: 25,
    blindCount: 24,
  },
};
