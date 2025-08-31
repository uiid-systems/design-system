import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Home,
  CircleArrowRight,
  Copy,
  Send,
  Bell,
  MessageCircleMore,
} from "lucide-react";
import { fn } from "storybook/test";
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

export const Variants: Story = {
  render: (args) => {
    const variants = [
      { variant: undefined, label: "default" },
      { variant: "inverted" as const, label: "inverted" },
      { variant: "primary" as const, label: "primary" },
      { variant: "secondary" as const, label: "secondary" },
      { variant: "tertiary" as const, label: "tertiary" },
    ];

    return (
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        {variants.map((variant) => (
          <Grid key={variant.label}>
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
          </Grid>
        ))}
      </div>
    );
  },
};
export const Sizes: Story = {
  render: (args) => (
    <Grid>
      <Button {...args} size="sm">
        sm
      </Button>
      <Button {...args} size="md">
        md
      </Button>
      <Button {...args} size="lg">
        lg
      </Button>
    </Grid>
  ),
};

export const Icons: Story = {
  render: (args) => (
    <Grid>
      <Button {...args} icon={<Home size={18} />} iconPosition="before">
        Go home
      </Button>
      <Button
        {...args}
        icon={<CircleArrowRight size={18} />}
        iconPosition="after"
      >
        Go to next step
      </Button>
      <Button {...args} icon={<Copy size={18} />} aria-label="Copy" />
    </Grid>
  ),
};

const Grid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {children}
    </div>
  );
};
