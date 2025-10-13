import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";

const meta = {
  title: "Primitives/Layout/Card",
  component: Card,
  args: {},
  render: (args) => (
    <Card {...args} render={<aside className="foo" />} className="bar">
      lorem ipsum dolor sit amet
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };
