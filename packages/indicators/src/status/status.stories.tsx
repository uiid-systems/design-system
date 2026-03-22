import type { Meta, StoryObj } from "@storybook/react-vite";

import { Group, Stack } from "@uiid/layout";

import { Status } from "./status";

const meta = {
  title: "Indicators/Status",
  component: Status,
  tags: ["beta"],
  args: {},
  argTypes: {
    pulse: { control: "boolean", table: { category: "Toggles" } },
    color: {
      control: "select",
      options: [
        undefined,
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
      ],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Status {...args} />
      <Status {...args}>with label</Status>
      <Status {...args} pulse>
        pulsing
      </Status>
      <Status {...args} inverted>
        inverted
      </Status>
    </Stack>
  ),
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Status" };

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
] as const;

export const Colors: Story = {
  render: (args) => (
    <Stack gap={4}>
      <Group gap={2}>
        {colors.map((color) => (
          <Status key={color} {...args} color={color} />
        ))}
      </Group>
      <Group gap={4}>
        {colors.map((color) => (
          <Status key={color} {...args} color={color}>
            {color}
          </Status>
        ))}
      </Group>
    </Stack>
  ),
};
