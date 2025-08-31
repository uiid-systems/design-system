import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Text, type TextProps } from "./text";

const levels: TextProps["level"][] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const meta = {
  title: "Typography/Text",
  component: Text,
  args: {},
  argTypes: {
    level: {
      control: "select",
      options: levels,
    },
  },
  render: (args) => (
    <Stack gap={8}>
      {levels.map((level) => (
        <Text {...args} key={level} level={level}>
          Level {level} ipsum dolor
        </Text>
      ))}
    </Stack>
  ),
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Text" };
