import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs, type BreadcrumbsItem } from "@uiid/navigation";

const MOCK_ITEMS: BreadcrumbsItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

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
