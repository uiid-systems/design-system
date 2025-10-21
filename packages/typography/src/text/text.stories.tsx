import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";
import type { TextProps } from "./text.types";

const levels: TextProps["level"][] = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

const meta = {
  title: "Typography/Text",
  component: Text,
  args: {},
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {levels.map((level) => (
        <Text {...args} key={level} level={level}>
          {level}: Lorem ipsum dolor
        </Text>
      ))}
      <Text {...args} level={-1} bold>
        Lorem ipsum dolor sit amet
      </Text>
    </div>
  ),
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Text" };
