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
const tones: TextProps["tone"][] = ["positive", "negative", "warning", "info"];
const weights: TextProps["weight"][] = ["bold", "normal", "light", "thin"];

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  tags: ["beta"],
  args: {
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  argTypes: {
    children: {
      control: "text",
      table: { category: "Content" },
    },
    size: {
      control: "select",
      options: levels,
      table: { category: "Variants" },
    },
    tone: {
      control: "select",
      options: tones,
      table: { category: "Variants" },
    },
    shade: {
      control: "select",
      options: shades,
      table: { category: "Variants" },
    },
    weight: {
      control: "select",
      options: weights,
      table: { category: "Variants" },
    },
    underline: {
      control: "boolean",
      table: { category: "Toggles" },
    },
    strikethrough: {
      control: "boolean",
      table: { category: "Toggles" },
    },
  },
  render: (args) => (
    <div style={{ width: "100%" }}>
      <Text {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Text" };
