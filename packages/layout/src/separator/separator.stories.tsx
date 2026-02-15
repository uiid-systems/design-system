import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@uiid/typography";
import { Stack, Group } from "../";

import { Separator } from "./separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["beta"],
  args: {},
  argTypes: {
    shade: {
      control: "select",
      options: [
        "background",
        "surface",
        "accent",
        "halftone",
        "muted",
        "foreground",
      ],
      table: { category: "Variants" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Variants" },
    },

    p: { control: "number", table: { category: "Spacing" } },
    px: { control: "number", table: { category: "Spacing" } },
    py: { control: "number", table: { category: "Spacing" } },
    pl: { control: "number", table: { category: "Spacing" } },
    pr: { control: "number", table: { category: "Spacing" } },
    pt: { control: "number", table: { category: "Spacing" } },
    pb: { control: "number", table: { category: "Spacing" } },
    m: { control: "number", table: { category: "Spacing" } },
    mx: { control: "number", table: { category: "Spacing" } },
    my: { control: "number", table: { category: "Spacing" } },
    ml: { control: "number", table: { category: "Spacing" } },
    mr: { control: "number", table: { category: "Spacing" } },
    mt: { control: "number", table: { category: "Spacing" } },
    mb: { control: "number", table: { category: "Spacing" } },
  },
  render: (args) => (
    <Stack gap={8} fullwidth maxw={640} ax="stretch">
      <Stack gap={2} ax="center">
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: "8px",
          }}
        />
        <Separator {...args} />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: "8px",
          }}
        />
      </Stack>

      <Group gap={2} minh={240} ay="center" ax="center">
        <div
          style={{
            background: "tomato",
            height: 64,
            width: 64,
            borderRadius: "8px",
          }}
        />
        <Separator {...args} orientation="vertical" />
        <div
          style={{
            background: "gold",
            height: 64,
            width: 64,
            borderRadius: "8px",
          }}
        />
      </Group>

      <Stack gap={4} ax="stretch">
        <Text size={1} weight="bold">
          With children
        </Text>
        <Separator {...args}>
          <Text size={0} shade="muted">
            or continue with email
          </Text>
        </Separator>
      </Stack>

      <Stack gap={4}>
        <Text size={1} weight="bold">
          With children (vertical)
        </Text>
        <Group gap={2} style={{ height: 120 }}>
          <div
            style={{
              background: "tomato",
              height: 64,
              width: 64,
              borderRadius: "8px",
            }}
          />
          <Separator {...args} orientation="vertical">
            <Text size={0} shade="muted">
              or
            </Text>
          </Separator>
          <div
            style={{
              background: "gold",
              height: 64,
              width: 64,
              borderRadius: "8px",
            }}
          />
        </Group>
      </Stack>
    </Stack>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Separator" };
