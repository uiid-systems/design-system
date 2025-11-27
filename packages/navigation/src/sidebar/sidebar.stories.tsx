import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarTrigger,
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
      <main
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <SidebarTrigger />
        <p>Content</p>
      </main>
    </SidebarProvider>
  ),
};
