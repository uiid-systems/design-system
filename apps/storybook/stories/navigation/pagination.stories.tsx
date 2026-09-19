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
    spread: { control: { type: "number", min: 0 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = { name: "Pagination" };

export const Numbered: Story = { render: () => <Examples.Numbered /> };

/** Three-digit pages grow past the square minimum instead of clipping. */
export const NumberedManyPages: Story = {
  args: { totalPages: 120, defaultPage: 100, spread: 1 },
};

/** Every enabled control is a real `<a href>`: hover for the URL, or middle-click to open a page in a new tab. */
export const Links: Story = { render: () => <Examples.Links /> };

export const Controlled: Story = { render: () => <Examples.Controlled /> };
