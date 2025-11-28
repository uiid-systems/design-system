import type { Meta, StoryObj } from "@storybook/react-vite";

import { Home } from "@uiid/icons";
import { List } from "@uiid/layout";
import { Text } from "@uiid/typography";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarAppContainer,
  SidebarFooter,
} from "./sidebar";
import { SidebarProvider } from "./sidebar.context";

const MOCK_LINKS = [
  {
    category: "Community",
    collapsible: true,
    icon: Home,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Find a match", value: "find-a-match" },
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
      <SidebarAppContainer style={{ height: "200dvh" }}>
        <SidebarTrigger />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </SidebarAppContainer>
    </SidebarProvider>
  ),
};

const AppSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <Text level={0} bold>
        Sidebar header
      </Text>
    </SidebarHeader>
    <SidebarContent>
      <List items={MOCK_LINKS} variant="line" fullwidth />
    </SidebarContent>
    <SidebarFooter>
      <Text level={0} bold>
        Sidebar footer
      </Text>
    </SidebarFooter>
  </Sidebar>
);
