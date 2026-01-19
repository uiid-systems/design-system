import type { Meta, StoryObj } from "@storybook/react-vite";
import { BackgroundFloatingLines } from "@uiid/backgrounds";

// Color constants
const COLOR_ELECTRIC_BLUE = "#6AF3FF";
const COLOR_SEA = "#005D8C";
const COLOR_ORCHID = "#D982FF";
const COLOR_LAVENDER = "#9EA3FF";
const COLOR_TURQUOISE = "#66EEC1";
const COLOR_SKY = "#60C5D9";

// Gradient presets
const GRADIENTS = {
  electric: [COLOR_ELECTRIC_BLUE, COLOR_SKY, "#002F46"],
  ocean: [COLOR_SEA, COLOR_SKY, COLOR_TURQUOISE],
  aurora: [COLOR_ELECTRIC_BLUE, COLOR_LAVENDER, COLOR_ORCHID],
  neon: [COLOR_ELECTRIC_BLUE, COLOR_ORCHID, COLOR_TURQUOISE],
};

// Default values
const DEFAULT_ENABLED_WAVES = ["top", "middle", "bottom"] as const;
const DEFAULT_LINE_COUNT = [4, 3, 3];
const DEFAULT_LINE_DISTANCE = [8, 6, 6];
const DEFAULT_TOP_WAVE_POSITION = { y: 0.25, amplitude: 0.15 };
const DEFAULT_MIDDLE_WAVE_POSITION = { y: 0.5, amplitude: 0.12 };
const DEFAULT_BOTTOM_WAVE_POSITION = { y: 0.75, amplitude: 0.1 };
const DEFAULT_ANIMATION_SPEED = 0.5;
const DEFAULT_INTERACTIVE = true;
const DEFAULT_BEND_RADIUS = 150;
const DEFAULT_BEND_STRENGTH = 0.3;
const DEFAULT_MOUSE_DAMPING = 0.1;
const DEFAULT_PARALLAX = true;
const DEFAULT_PARALLAX_STRENGTH = 0.02;
const DEFAULT_MIX_BLEND_MODE = "screen";

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
