import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  COLOR_ELECTRIC_BLUE,
  COLOR_FOREST,
  COLOR_LAVENDER,
  COLOR_MIDNIGHT,
  COLOR_ORCHID,
  COLOR_SEA,
  COLOR_SKY,
  COLOR_TURQUOISE,
} from "../backgrounds.constants";
import { BackgroundIridescence } from "./iridescence";

const meta: Meta<typeof BackgroundIridescence> = {
  title: "Backgrounds/Iridescence",
  args: {},
  argTypes: {
    color: { control: "color" },
    speed: { control: { type: "range", min: 0.1, max: 5, step: 0.1 } },
    amplitude: { control: { type: "range", min: 0.01, max: 1, step: 0.01 } },
    mouseReact: { control: "boolean" },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <BackgroundIridescence {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default (White)",
};

export const Electric: Story = {
  name: "Electric Blue",
  args: { color: COLOR_ELECTRIC_BLUE },
};

export const Ocean: Story = {
  name: "Ocean",
  args: { color: COLOR_SEA },
};

export const Sky: Story = {
  name: "Sky",
  args: { color: COLOR_SKY },
};

export const Aurora: Story = {
  name: "Aurora",
  args: { color: COLOR_LAVENDER },
};

export const Orchid: Story = {
  name: "Orchid",
  args: { color: COLOR_ORCHID },
};

export const Forest: Story = {
  name: "Forest",
  args: { color: COLOR_FOREST },
};

export const Turquoise: Story = {
  name: "Turquoise",
  args: { color: COLOR_TURQUOISE },
};

export const Midnight: Story = {
  name: "Midnight",
  args: { color: COLOR_MIDNIGHT },
};

export const FastElectric: Story = {
  name: "Fast Electric",
  args: { color: COLOR_ELECTRIC_BLUE, speed: 3, amplitude: 0.3 },
};

export const SubtleOrchid: Story = {
  name: "Subtle Orchid",
  args: { color: COLOR_ORCHID, speed: 0.5, amplitude: 0.05 },
};
