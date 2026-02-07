import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";
import type { TextProps } from "./text.types";

const levels: TextProps["size"][] = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
const shades: TextProps["shade"][] = [
  "background",
  "surface",
  "accent",
  "halftone",
  "muted",
  "foreground",
];
const tones: TextProps["tone"][] = ["positive", "critical", "warning", "info"];
const weights: TextProps["weight"][] = ["bold", "normal", "light", "thin"];
const families: TextProps["family"][] = ["mono", "serif", "sans"];

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  tags: ["beta"],
  args: {
    children:
      "This PR was opened by the Changesets release GitHub action. When you're ready to do a release, you can merge this and publish to npm yourself or setup this action to publish automatically. If you're not ready to do a release yet, that's fine, whenever you add more changesets to main, this PR will be updated.",
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
    shade: {
      control: "select",
      options: shades,
      table: { category: "Variants" },
    },
    family: {
      control: "select",
      options: families,
      table: { category: "Variants" },
    },
    tone: {
      control: "select",
      options: tones,
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
    balance: {
      control: "boolean",
      table: { category: "Toggles" },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 48,
        width: "100%",
      }}
    >
      <Text {...args} size={-1} />
      <Text {...args} size={0} />
      <Text {...args} size={1} />
      {/* <Text {...args} size={2} />
      <Text {...args} size={3} />
      <Text {...args} size={4} />
      <Text {...args} size={5} />
      <Text {...args} size={6} /> */}
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Text" };
