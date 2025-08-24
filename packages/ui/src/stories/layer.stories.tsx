import type { Meta, StoryObj } from "@storybook/react-vite";

import { Layer, Stack } from "../components/layout";

/**
 * @todo handle fragments as layer children
 */
const meta = {
  title: "Layout/Layer",
  component: Layer,
  args: {},
  render: (args) => (
    <Stack gap={2}>
      <Layer {...args}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <div style={{ background: "gold", height: 64, width: 64 }} />
        <div style={{ background: "mediumseagreen", height: 64, width: 64 }} />
      </Layer>

      <Layer {...args} offset={{ x: 20 }}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <div style={{ background: "gold", height: 64, width: 64 }} />
        <div style={{ background: "mediumseagreen", height: 64, width: 64 }} />
      </Layer>

      <Layer {...args} offset={{ y: 20 }}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <div style={{ background: "gold", height: 64, width: 64 }} />
        <div style={{ background: "mediumseagreen", height: 64, width: 64 }} />
      </Layer>

      <Layer {...args} offset={{ x: 20, y: 20 }}>
        <div style={{ background: "tomato", height: 64, width: 64 }} />
        <div style={{ background: "gold", height: 64, width: 64 }} />
        <div style={{ background: "mediumseagreen", height: 64, width: 64 }} />
      </Layer>
    </Stack>
  ),
} satisfies Meta<typeof Layer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Layer" };
