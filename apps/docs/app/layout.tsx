// First, so Tailwind's cascade layers are declared before any `uiid.*` layer.
// A CSS module imported ahead of it would put the whole `uiid` layer under
// Tailwind's reset, and every spacing and border prop would read as 0.
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { OnThisPage, Pager } from "@/components/docs";
import { Header } from "@/components/header";
import {
  Body,
  AppShellOuter,
  AppShellInner,
  AsideContainer,
  ContentRow,
  Main,
  noFlashScript,
  SIDEBAR_ATTRIBUTE,
  SIDEBAR_GROUPS_STORAGE_KEY,
  SIDEBAR_STORAGE_KEY,
} from "@/components/shell";
import { Sidebar } from "@/components/sidebar";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: noFlashScript({
              sidebarKey: SIDEBAR_STORAGE_KEY,
              sidebarAttribute: SIDEBAR_ATTRIBUTE,
              groupsKey: SIDEBAR_GROUPS_STORAGE_KEY,
            }),
          }}
        />
      </head>
      <Body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppShellOuter>
          <Sidebar />
          <AppShellInner>
            <Header />
            <ContentRow>
              <Main>
                {children}
                <Pager />
              </Main>
              <AsideContainer>
                <OnThisPage />
              </AsideContainer>
            </ContentRow>
          </AppShellInner>
        </AppShellOuter>
      </Body>
    </html>
  );
}
