import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/pagination/pagination.examples";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    totalPages: 31,
  },
  argTypes: {
    totalPages: { control: { type: "number", min: 0 } },
    defaultPage: { control: { type: "number", min: 1 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = { name: "Pagination" };

export const Controlled: Story = { render: () => <Examples.Controlled /> };
