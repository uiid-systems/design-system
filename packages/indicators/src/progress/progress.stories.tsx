import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Progress } from "./progress";

const meta = {
  title: "Indicators/Progress",
  component: Progress,
  tags: ["beta"],
  args: {
    value: 45,
    label: "Uploading files",
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
      table: { category: "Props" },
    },
    label: {
      control: "text",
      table: { category: "Props" },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
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
        "neutral",
      ],
      table: { category: "Variants" },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Progress" };

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={8}>
      <Progress {...args} size="small" label="Small" />
      <Progress {...args} size="medium" label="Medium" />
      <Progress {...args} size="large" label="Large" />
    </Stack>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <Stack gap={8}>
      <Progress {...args} color="green" value={80} label="Complete" />
      <Progress {...args} color="blue" value={45} label="In progress" />
      <Progress {...args} color="orange" value={20} label="Starting" />
      <Progress {...args} color="red" value={10} label="Error" />
    </Stack>
  ),
};

export const NoLabel: Story = {
  name: "No label",
  args: {
    label: undefined,
    value: 60,
  },
};
