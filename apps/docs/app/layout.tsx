import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { HeaderLinks, OnThisPage, Pager } from "@/components/docs";
import { Header } from "@/components/header";
import { Main } from "@/components/main";
import { Shell, ShellBody } from "@/components/shell";
import { Sidebar, SidebarScript } from "@/components/sidebar";
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
        <SidebarScript />
      </head>
      <ShellBody className={`${geistSans.variable} ${geistMono.variable}`}>
        <Shell
          sidebar={<Sidebar title="uiid docs" />}
          header={
            <Header>
              <HeaderLinks />
            </Header>
          }
        >
          <Main aside={<OnThisPage />}>
            {children}
            <Pager />
          </Main>
        </Shell>
      </ShellBody>
    </html>
  );
}
