import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Home } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

import { Button } from "./button";

const meta = {
  title: "Buttons/Button",
  component: Button,
  args: {
    onClick: fn(),
    tooltip: "Tooltip",
  },
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["rounded", "pill"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Button",
  render: (args) => {
    const variants = [
      { variant: undefined, label: "default" },
      { variant: "subtle" as const, label: "subtle" },
      { variant: "inverted" as const, label: "inverted" },
      { variant: "ghost" as const, label: "ghost" },
    ];

    return (
      <Stack gap={4}>
        {variants.map((variant) => (
          <Group gap={2} ay="center" key={variant.label}>
            <Button {...args} variant={variant.variant}>
              <Home />
              default
            </Button>
            <Button {...args} variant={variant.variant} disabled>
              disabled
            </Button>
            <Button loading {...args} variant={variant.variant}>
              lorem
            </Button>
            <Button {...args} variant={variant.variant} shape="pill">
              pill
            </Button>

            <Button {...args} variant={variant.variant} square>
              <Home />
            </Button>
          </Group>
        ))}
      </Stack>
    );
  },
};
