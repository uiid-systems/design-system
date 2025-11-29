import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Breadcrumbs,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "./breadcrumbs";

// const MOCK_LINKS: ListProps["items"] = [
//   {
//     category: "Community",
//     collapsible: true,
//     icon: Home,
//     items: [
//       { label: "Leaderboards", value: "leaderboards" },
//       { label: "Recent matches", value: "recent-matches" },
//       { label: "Find a match", value: "find-a-match" },
//     ],
//   },
//   {
//     category: "Favorites",
//     collapsible: true,
//     icon: Heart,
//     items: [
//       { label: "Allie Hyde", value: "allie-hyde" },
//       { label: "Sammy Shuffle", value: "sammy-shuffle" },
//       { label: "Jimmy Biscuits", value: "jimmy-biscuits" },
//       { label: "Bobby Tables", value: "bobby-tables" },
//       { label: "Sally Sunshine", value: "sally-sunshine" },
//     ],
//   },
// ];

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Breadcrumbs",
  render: () => (
    <Breadcrumbs>
      <BreadcrumbsList>
        <BreadcrumbsItem>
          <a href="/">Home</a>
        </BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>
          <a href="/">Somewhere else</a>
        </BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>
          <span>Current page</span>
        </BreadcrumbsItem>
      </BreadcrumbsList>
    </Breadcrumbs>
  ),
};
