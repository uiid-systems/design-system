import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Group, Stack } from "@uiid/design-system";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

import {
  CONTENT_MAX_WIDTH,
  SHELL_SPACING,
  SHELL_BORDER_WIDTH,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/constants";

import "./globals.css";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Stack
        data-slot="body"
        render={<body />}
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        fullwidth
      >
        <AppShellOuter>
          <Sidebar />
          <AppShellInner>
            <Header />
            <Main>{children}</Main>
          </AppShellInner>
        </AppShellOuter>
      </Stack>
    </html>
  );
}

const AppShellOuter = ({ children }: React.PropsWithChildren) => {
  return (
    <Group data-slot="app-shell-outer" fullwidth>
      {children}
    </Group>
  );
};
AppShellOuter.displayName = "AppShellOuter";

const AppShellInner = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack data-slot="app-shell-inner" className="flex-1">
      {children}
    </Stack>
  );
};
AppShellInner.displayName = "AppShellInner";

const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="main"
      render={<main />}
      maxw={CONTENT_MAX_WIDTH}
      br={SHELL_BORDER_WIDTH}
      p={SHELL_SPACING}
      fullwidth
      fullheight
    >
      {children}
    </Stack>
  );
};
Main.displayName = "Main";
