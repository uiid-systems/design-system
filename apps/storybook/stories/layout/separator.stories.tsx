import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator, Stack } from "@uiid/design-system";

import * as Examples from "../../../../packages/layout/src/separator/separator.examples";
import {
  disabledControls,
  marginControls,
  paddingControls,
  sizeControls,
} from "./constants";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  args: { shade: "halftone" },
  argTypes: {
    shade: {
      control: "select",
      options: [
        "background",
        "surface",
        "accent",
        "halftone",
        "muted",
        "foreground",
      ],
      table: { category: "Variants" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Variants" },
    },
    gap: { control: "number", table: { category: "Spacing" } },
    ...sizeControls,
    ...paddingControls,
    ...marginControls,
    ...disabledControls,
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Stack ax="stretch" gap={4} fullwidth maxw={400}>
      <Examples.ExampleBox bg="tomato" h={48} />
      <Separator {...args} />
      <Examples.ExampleBox bg="gold" h={48} />
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => <Examples.Horizontal />,
};

export const Vertical: Story = {
  render: () => <Examples.Vertical />,
};

export const WithChildren: Story = {
  render: () => <Examples.WithChildren />,
};

export const Shades: Story = {
  render: () => <Examples.Shades />,
};
