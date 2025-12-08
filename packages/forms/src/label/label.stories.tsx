import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import type { LabelProps } from "./label.types";

const meta = {
  title: "Forms/Label",
  component: Label,
  args: {},
  render: (args) => <Label {...args}>Label</Label>,
} satisfies Meta<LabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Label" };
