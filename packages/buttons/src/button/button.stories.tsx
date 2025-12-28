import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

import { Button } from "./button";

const meta = {
  title: "Buttons/Button",
  component: Button,
  args: {
    tooltip: "Tooltip",
    disabled: false,
    ghost: false,
    grows: true,
    pill: false,
    square: false,
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    grows: { control: "boolean", table: { category: "Toggles" } },
    pill: { control: "boolean", table: { category: "Toggles" } },
    square: { control: "boolean", table: { category: "Toggles" } },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["subtle", "inverted"],
      table: { category: "Variants" },
    },
    onClick: { action: "onClick", table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Button",
  render: (args) => {
    return (
      <Stack gap={4}>
        <Button {...args} tooltip="Tooltip">
          <Globe />
          default
        </Button>

        <Group gap={2}>
          <Button {...args} tooltip="Tooltip" pill square grows>
            <Globe />
          </Button>
          <Button {...args} tooltip="Tooltip" pill grows>
            <Globe />
            travel the world
          </Button>
        </Group>
      </Stack>
    );
  },
};
