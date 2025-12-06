import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  name: "Pagination",
  render: () => <Pagination />,
};
