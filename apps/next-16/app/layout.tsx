import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider, SidebarAppContainer } from "@uiid/navigation";
import { ToastProvider, Toaster } from "@uiid/overlays";

import { AppSidebar, AppHeader } from "../components/navigation";
import { PageContainer } from "../components/global";

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
      <ToastProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
          >
            <AppSidebar />
            <SidebarAppContainer>
              <AppHeader />
              {/* <AppAlert /> */}

              <PageContainer>{children}</PageContainer>
              <Toaster />
            </SidebarAppContainer>
          </body>
        </html>
      </ToastProvider>
    </SidebarProvider>
  );
}
