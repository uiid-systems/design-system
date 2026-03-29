import type { Meta, StoryObj } from "@storybook/react-vite";

import { Group } from "@uiid/layout";

import { Kbd } from "./kbd";

const meta = {
  title: "Indicators/Kbd",
  component: Kbd,
  tags: ["new"],
  args: {},
  render: () => <Kbd hotkey={["meta", "b"]} />,
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Kbd" };

export const ActiveOnKeyPress: Story = {
  name: "Active on key press",
  render: () => (
    <Group gap={2}>
      <Kbd hotkey={["shift"]} />
      <Kbd hotkey={["meta"]} />
      <Kbd hotkey={["meta", "b"]} />
      <Kbd hotkey={["meta", "k"]} />
      <Kbd hotkey={["arrowup"]} />
      <Kbd hotkey={["arrowdown"]} />
    </Group>
  ),
};

export const Controlled: Story = {
  name: "Controlled active",
  render: () => (
    <Group gap={2}>
      <Kbd hotkey={["meta", "b"]} active />
      <Kbd hotkey={["meta", "k"]} active={false} />
    </Group>
  ),
};
