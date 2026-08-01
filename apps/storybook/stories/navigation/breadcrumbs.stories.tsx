import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "@uiid/design-system";

import { MOCK_ITEMS, MOCK_ITEMS_WITH_ICON } from "./breadcrumbs.mocks";

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

export const WithIcon: Story = {
  name: "With Icon",
  render: () => <Breadcrumbs items={MOCK_ITEMS_WITH_ICON} />,
};
