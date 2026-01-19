import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ListProps } from "@uiid/lists";
import { Home, Heart, UserCircle } from "@uiid/icons";
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
  SidebarProvider,
  useSidebar,
} from "@uiid/navigation";

const MOCK_LINKS: ListProps["items"] = [
  {
    label: "TODO: Fix top-level item",
    value: "top-level-item",
    icon: UserCircle,
  },
  {
    category: "TODO: Fix non-collapsible",
    icon: Home,
    items: [
      { label: "Subitem 1", value: "subitem-1" },
      { label: "Subitem 2", value: "subitem-2" },
      { label: "Subitem 3", value: "subitem-3" },
    ],
  },
  {
    category: "Community",
    collapsible: true,
    icon: Home,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Recent matches", value: "recent-matches" },
      { label: "Find a match", value: "find-a-match" },
      { label: "Join the Discord", value: "join-the-discord" },
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
      { label: "More...", value: "more" },
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
        <SidebarList items={MOCK_LINKS} />
      </SidebarContent>
      <SidebarFooter>
        <Text size={0} weight="bold">
          Sidebar footer
        </Text>
      </SidebarFooter>
    </Sidebar>
  );
};
AppSidebar.displayName = "AppSidebar";

const AppTitle = ({ children }: React.PropsWithChildren) => {
  const { open } = useSidebar();
  return (
    <Text
      data-hide-collapsed
      size={0}
      shade="accent"
      weight="bold"
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
