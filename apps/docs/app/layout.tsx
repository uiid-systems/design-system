import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Stack } from "@uiid/layout";
import { SidebarProvider, SidebarAppContainer, SidebarInset } from "@uiid/navigation";

import { DocsSidebar, DocsHeader } from "@/components";

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
  title: "UIID Documentation",
  description:
    "Documentation for UIID - A modern, modular component library built with TypeScript, Vite, React, and CSS Modules.",
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
          <SidebarAppContainer>
            <DocsSidebar />
            <SidebarInset>
              <Stack style={{ minHeight: "100vh" }}>
                <DocsHeader />
                <Stack style={{ flex: 1 }}>{children}</Stack>
              </Stack>
            </SidebarInset>
          </SidebarAppContainer>
        </body>
      </html>
    </SidebarProvider>
  );
}
