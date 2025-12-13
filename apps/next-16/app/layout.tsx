import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider, SidebarAppContainer } from "@uiid/navigation";

import { AppSidebar, AppHeader } from "../components/navigation";
import { PageContainer, AppAlert } from "../components/global";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UIID Design System",
  description:
    "A modern, modular component library built with TypeScript, Vite, React, CSS Modules and Base UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <AppSidebar />
          <SidebarAppContainer>
            <AppHeader />
            <AppAlert />

            <PageContainer>{children}</PageContainer>
          </SidebarAppContainer>
        </body>
      </html>
    </SidebarProvider>
  );
}
