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
    loading: false,
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    loading: { control: "boolean", table: { category: "Toggles" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["subtle", "ghost", "inverted"],
      table: { category: "Variants" },
    },
    shape: {
      control: "select",
      options: ["pill", "square", "circle"],
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
          <Button {...args} shape="square">
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
          <Button {...args} variant="ghost">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="inverted">
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} shape="circle">
            <GlobeIcon />
          </Button>
          <Button {...args} shape="pill">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} disabled shape="pill">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="subtle" shape="pill">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="ghost" shape="pill">
            <GlobeIcon />
            travel the world
          </Button>
          <Button {...args} variant="inverted" shape="pill">
            <GlobeIcon />
            travel the world
          </Button>
        </Group>

        <Group gap={2}>
          <Button {...args} tone="positive">
            Positive tone
            <CircleCheckIcon />
          </Button>
          <Button {...args} tone="critical">
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
