import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  GRADIENTS,
  COLOR_ELECTRIC_BLUE,
  COLOR_SKY,
  COLOR_ORCHID,
  COLOR_TURQUOISE,
  COLOR_LAVENDER,
  COLOR_SEA,
} from "../backgrounds.constants";

import {
  DEFAULT_BOTTOM_WAVE_POSITION,
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_BEND_RADIUS,
  DEFAULT_INTERACTIVE,
  DEFAULT_BEND_STRENGTH,
  DEFAULT_ENABLED_WAVES,
  DEFAULT_LINE_COUNT,
  DEFAULT_LINE_DISTANCE,
  DEFAULT_MOUSE_DAMPING,
  DEFAULT_MIX_BLEND_MODE,
  DEFAULT_PARALLAX,
  DEFAULT_PARALLAX_STRENGTH,
  DEFAULT_MIDDLE_WAVE_POSITION,
  DEFAULT_TOP_WAVE_POSITION,
} from "./floating-lines.constants";
import { BackgroundFloatingLines } from "./floating-lines";

const meta: Meta<typeof BackgroundFloatingLines> = {
  title: "Backgrounds/Floating Lines",
  tags: ["new"],
  args: {
    enabledWaves: DEFAULT_ENABLED_WAVES,
    lineCount: DEFAULT_LINE_COUNT,
    lineDistance: DEFAULT_LINE_DISTANCE,
    topWavePosition: DEFAULT_TOP_WAVE_POSITION,
    middleWavePosition: DEFAULT_MIDDLE_WAVE_POSITION,
    bottomWavePosition: DEFAULT_BOTTOM_WAVE_POSITION,
    animationSpeed: DEFAULT_ANIMATION_SPEED,
    interactive: DEFAULT_INTERACTIVE,
    bendRadius: DEFAULT_BEND_RADIUS,
    bendStrength: DEFAULT_BEND_STRENGTH,
    mouseDamping: DEFAULT_MOUSE_DAMPING,
    parallax: DEFAULT_PARALLAX,
    parallaxStrength: DEFAULT_PARALLAX_STRENGTH,
    mixBlendMode: DEFAULT_MIX_BLEND_MODE,
  },
  argTypes: {
    linesGradient: { control: "object" },
    enabledWaves: {
      control: "inline-check",
      options: ["top", "middle", "bottom"],
    },
    lineCount: { control: "number" },
    lineDistance: { control: "number" },
    topWavePosition: { control: "object" },
    middleWavePosition: { control: "object" },
    bottomWavePosition: { control: "object" },
    animationSpeed: { control: "number" },
    interactive: { control: "boolean" },
    bendRadius: { control: "number" },
    bendStrength: { control: "number" },
    mouseDamping: { control: "number" },
    parallax: { control: "boolean" },
    parallaxStrength: { control: "number" },
    mixBlendMode: {
      control: "select",
      options: [
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <BackgroundFloatingLines {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Floating Lines" };

export const Electric: Story = {
  name: "Electric",
  args: { linesGradient: [...GRADIENTS.electric] },
};

export const Ocean: Story = {
  name: "Ocean",
  args: { linesGradient: [...GRADIENTS.ocean] },
};

export const BackgroundAurora: Story = {
  name: "BackgroundAurora",
  args: { linesGradient: [...GRADIENTS.aurora] },
};

export const Neon: Story = {
  name: "Neon",
  args: { linesGradient: [...GRADIENTS.neon] },
};

export const AllWavesBright: Story = {
  name: "All Waves Bright",
  args: {
    linesGradient: [
      COLOR_ELECTRIC_BLUE,
      COLOR_ORCHID,
      COLOR_LAVENDER,
      COLOR_TURQUOISE,
      COLOR_SKY,
      COLOR_SEA,
    ],
    lineCount: [8, 6, 6],
    lineDistance: [6, 5, 5],
  },
};
