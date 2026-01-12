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
} from "../backgrounds.constants";
import { BackgroundLiquidChrome } from "./liquid-chrome";

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
