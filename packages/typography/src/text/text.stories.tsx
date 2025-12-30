import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";
import type { TextProps } from "./text.types";

const levels: TextProps["size"][] = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
const shades: TextProps["shade"][] = [
  "background",
  "surface",
  "muted",
  "halftone",
  "accent",
  "foreground",
];

const meta = {
  title: "Typography/Text",
  component: Text,
  args: {},
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {levels.map((level) => (
        <Text {...args} key={level} size={level}>
          {level}: Lorem ipsum dolor
        </Text>
      ))}
      {shades.map((shade) => (
        <Text {...args} key={shade} size={2} shade={shade} bold>
          {shade}: Lorem ipsum dolor
        </Text>
      ))}
    </div>
  ),
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Text" };
