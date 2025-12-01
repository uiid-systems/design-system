import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumbs } from "./breadcrumbs";

import { MOCK_ITEMS } from "./breadcrumbs.mocks";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Breadcrumbs",
  render: () => <Breadcrumbs items={MOCK_ITEMS} />,
};
