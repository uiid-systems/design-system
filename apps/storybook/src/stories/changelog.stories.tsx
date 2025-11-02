import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta = {
  title: "Changelog",
  render: () => <div>Changelog</div>,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Changelog" };
