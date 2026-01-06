import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Layer } from "../";

/**
 * @todo handle fragments as layer children
 */
const meta = {
  title: "Layout/Layer",
  component: Layer,
  tags: ["beta"],
  args: {
    offset: { x: 0, y: 0 },
  },
  argTypes: {
    offset: {
      control: "object",
      table: { category: "Spacing" },
    },
    render: { table: { disable: true } },
    children: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Stack gap={2}>
      <Layer {...args}>
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "mediumseagreen",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
      </Layer>

      <Layer {...args} offset={{ x: 20 }}>
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "mediumseagreen",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
      </Layer>

      <Layer {...args} offset={{ y: 20 }}>
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "mediumseagreen",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
      </Layer>

      <Layer {...args} offset={{ x: 20, y: 20 }}>
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
        <div
          style={{
            background: "mediumseagreen",
            height: 64,
            width: 64,
            borderRadius: 8,
            border: "2px solid var(--shade-background)",
          }}
        />
      </Layer>
    </Stack>
  ),
} satisfies Meta<typeof Layer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Layer" };
