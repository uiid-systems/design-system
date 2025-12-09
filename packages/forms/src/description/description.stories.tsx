import type { Meta, StoryObj } from "@storybook/react-vite";

import { Description } from "./description";
import type { DescriptionProps } from "./description.types";

const meta = {
  title: "Forms/Typography/Description",
  component: Description,
  args: {},
  render: (args) => <Description {...args}>Description</Description>,
} satisfies Meta<DescriptionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Description" };
