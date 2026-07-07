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

// Applies the stored color scheme to <html> before first paint so a saved
// light/dark preference never flashes the default scheme on reload. Kept in
// sync with COLOR_SCHEME_STORAGE_KEY in hooks/use-color-scheme.ts.
const COLOR_SCHEME_SCRIPT = `try{var t=localStorage.getItem('uiid-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: COLOR_SCHEME_SCRIPT }} />
      </head>
      <Body>
        <AppShellOuter>
          <Sidebar />
          <AppShellInner>
            <Header />
            <Main>{children}</Main>
          </AppShellInner>
        </AppShellOuter>
      </Body>
    </html>
  );
}

const Body = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="body"
      render={<body />}
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      fullwidth
    >
      {children}
    </Stack>
  );
};
Body.displayName = "Body";

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
