import type { Metadata } from "next";

import { SidebarAppContainer } from "@uiid/navigation";
import { Toaster } from "@uiid/overlays";

import { AppSidebar, AppHeader } from "@/components/navigation";
import { PageContainer } from "@/components/global";

export const metadata: Metadata = {
  title: "UIID Design System - Dashboard",
  description: "Building a dashboard for a shuffleboard community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      <SidebarAppContainer>
        <AppHeader />
        <PageContainer>{children}</PageContainer>
        <Toaster />
      </SidebarAppContainer>
    </>
  );
}
