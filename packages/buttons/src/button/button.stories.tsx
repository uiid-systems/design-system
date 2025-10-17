import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Send, Bell, MessageCircleMore, ExternalLink } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

import { Button } from "./button";

const meta = {
  title: "Buttons/Button",
  component: Button,
  args: {
    onClick: fn(),
  },
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    fill: { control: "select", options: ["solid", "outline", "ghost"] },
    shape: { control: "select", options: ["rounded", "pill"] },
    loadingText: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Button",
  render: (args) => {
    const variants = [
      { variant: undefined, label: "default" },
      { variant: "inverted" as const, label: "inverted" },
      { variant: "primary" as const, label: "primary" },
      { variant: "secondary" as const, label: "secondary" },
      { variant: "tertiary" as const, label: "tertiary" },
    ];

    return (
      <Stack gap={4}>
        {variants.map((variant) => (
          <Group gap={2} ay="center" key={variant.label}>
            <Button {...args} variant={variant.variant}>
              default
            </Button>
            <Button {...args} variant={variant.variant} disabled>
              disabled
            </Button>
            <Button loading {...args} variant={variant.variant}>
              lorem
            </Button>
            <Button {...args} variant={variant.variant} fill="outline">
              outline
            </Button>
            <Button {...args} variant={variant.variant} fill="ghost">
              ghost
            </Button>
            <Button {...args} variant={variant.variant} shape="pill">
              pill
            </Button>
            <Button
              {...args}
              icon={<Send size={18} />}
              aria-label="Send email"
              variant={variant.variant}
            />
            <Button
              {...args}
              icon={<MessageCircleMore size={18} />}
              aria-label="View more messages"
              variant={variant.variant}
              fill="outline"
            />
            <Button
              {...args}
              icon={<Bell size={18} />}
              aria-label="Set alarm"
              variant={variant.variant}
              fill="ghost"
            />
          </Group>
        ))}
        <Button
          {...args}
          href="https://google.com"
          target="_blank"
          icon={<ExternalLink size={18} />}
          iconPosition="after"
        >
          go to google.com
        </Button>
      </Stack>
    );
  },
};
