import type { Meta, StoryObj } from "@storybook/react-vite";
import { Newsletter } from "./newsletter";

const meta = {
  title: "Blocks/Newsletter",
  component: Newsletter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Newsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Newsletter",
};
