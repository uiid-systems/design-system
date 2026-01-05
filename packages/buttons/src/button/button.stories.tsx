import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  GlobeIcon,
  ExternalLinkIcon,
  CircleCheckIcon,
  BanIcon,
  TriangleAlertIcon,
  InfoIcon,
} from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Button } from "./button";

const meta = {
  title: "Buttons/Button",
  component: Button,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    tooltip: "tooltip",
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    grows: { control: "boolean", table: { category: "Toggles" } },
    pill: { control: "boolean", table: { category: "Toggles" } },
    square: { control: "boolean", table: { category: "Toggles" } },
    circle: { control: "boolean", table: { category: "Toggles" } },

    tooltip: { control: "text", table: { category: "Text" } },

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

    onClick: { table: { category: "Events" } },
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
          <Button {...args} square>
            <GlobeIcon />
          </Button>
          <Button {...args}>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} disabled>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="subtle">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="inverted">
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} circle>
            <GlobeIcon />
          </Button>
          <Button {...args} pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} disabled pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="subtle" pill>
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="inverted" pill>
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} tone="positive">
            Positive tone
            <CircleCheckIcon />
          </Button>
          <Button {...args} tone="negative">
            Negative tone
            <BanIcon />
          </Button>
          <Button {...args} tone="warning">
            Warning tone
            <TriangleAlertIcon />
          </Button>
          <Button {...args} tone="info">
            Info tone
            <InfoIcon />
          </Button>
        </Group>
        <Button
          {...args}
          nativeButton={false}
          render={<a href="https://www.google.com" target="_blank" />}
          tooltip={
            <Text size={-1}>
              use{" "}
              <Text weight="bold" tone="info">
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
