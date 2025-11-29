import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ListProps } from "@uiid/layout";

import { Home, Heart } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarList,
  SidebarTrigger,
  SidebarAppContainer,
  SidebarFooter,
  SidebarGroup,
} from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar.context";

const MOCK_LINKS: ListProps["items"] = [
  {
    category: "Community",
    collapsible: true,
    icon: Home,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Recent matches", value: "recent-matches" },
      { label: "Find a match", value: "find-a-match" },
    ],
  },
  {
    category: "Favorites",
    collapsible: true,
    icon: Heart,
    items: [
      { label: "Allie Hyde", value: "allie-hyde" },
      { label: "Sammy Shuffle", value: "sammy-shuffle" },
      { label: "Jimmy Biscuits", value: "jimmy-biscuits" },
      { label: "Bobby Tables", value: "bobby-tables" },
      { label: "Sally Sunshine", value: "sally-sunshine" },
    ],
  },
];

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Sidebar",
  render: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarAppContainer />
    </SidebarProvider>
  ),
};

const AppSidebar = () => {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Group gap={open ? 1 : 0} ay="center" fullwidth>
          <AppTitle>UIID Design System</AppTitle>
          <SidebarTrigger />
        </Group>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup category="Community">
          <SidebarList items={MOCK_LINKS} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Text level={0} bold>
          Sidebar footer
        </Text>
      </SidebarFooter>
    </Sidebar>
  );
};

const AppTitle = ({ children }: React.PropsWithChildren) => {
  const { open } = useSidebar();
  return (
    <Text
      data-hide-collapsed
      level={0}
      shade="accent"
      bold
      pl={open ? 2 : 0}
      style={{
        overflow: "hidden",
        alignContent: "center",
        textWrap: "nowrap",
        flex: open ? 1 : undefined,
      }}
    >
      {children}
    </Text>
  );
};
AppTitle.displayName = "AppTitle";
