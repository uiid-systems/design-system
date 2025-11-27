import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarTrigger,
  SidebarAppContainer,
} from "./sidebar";
import { SidebarProvider } from "./sidebar.context";

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
      <SidebarAppContainer>
        <SidebarTrigger />
        <p>Content</p>
      </SidebarAppContainer>
    </SidebarProvider>
  ),
};

const AppSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <h1>Sidebar</h1>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>Home</SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
);
