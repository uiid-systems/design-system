import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobeIcon, ExternalLinkIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Button } from "./button";

const meta = {
  title: "Buttons/Button",
  component: Button,
  tags: ["beta"],
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
        <Group gap={2}>
          <Button {...args} tooltip="Tooltip" square>
            <GlobeIcon />
          </Button>
          <Button {...args} tooltip="Tooltip">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" disabled>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" variant="subtle">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" variant="inverted">
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} tooltip="Tooltip" circle>
            <GlobeIcon />
          </Button>
          <Button {...args} tooltip="Tooltip" pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" disabled pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" variant="subtle" pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} tooltip="Tooltip" variant="inverted" pill>
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} tooltip="Tooltip" tone="positive">
            Positive tone
          </Button>
          <Button {...args} tooltip="Tooltip" tone="negative">
            Negative tone
          </Button>
          <Button {...args} tooltip="Tooltip" tone="warning">
            Warning tone
          </Button>
          <Button {...args} tooltip="Tooltip" tone="info">
            Info tone
          </Button>
        </Group>
        <Button
          {...args}
          nativeButton={false}
          render={<a href="https://www.google.com" target="_blank" />}
          tooltip={
            <Text size={-1}>
              use{" "}
              <Text bold tone="info">
                nativeButton
              </Text>{" "}
              when rendering a link
            </Text>
          }
        >
          google.com
          <ExternalLinkIcon />
        </Button>
      </Stack>
    );
  },
};
