import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Text, useSidebar } from "@uiid/design-system";
import type { ListProps } from "@uiid/design-system";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarList,
  SidebarTrigger,
  SidebarAppContainer,
  SidebarFooter,
  SidebarProvider,
} from "@uiid/design-system";
import { Home, Heart, UserCircle } from "@uiid/icons";

const MOCK_LINKS: ListProps["items"] = [
  {
    label: "TODO: Fix top-level item",
    icon: UserCircle,
  },
  {
    category: "TODO: Fix non-collapsible",
    icon: Home,
    items: [
      { label: "Subitem 1" },
      { label: "Subitem 2" },
      { label: "Subitem 3" },
    ],
  },
  {
    category: "Community",
    icon: Home,
    items: [
      { label: "Leaderboards" },
      { label: "Recent matches" },
      { label: "Find a match" },
      { label: "Join the Discord" },
    ],
  },
  {
    category: "Favorites",
    icon: Heart,
    items: [
      { label: "Allie Hyde" },
      { label: "Sammy Shuffle" },
      { label: "Jimmy Biscuits" },
      { label: "More..." },
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
      shade="muted"
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
