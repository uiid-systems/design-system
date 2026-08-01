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
} from "@/components/shell";
import { Sidebar } from "@/components/sidebar";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants";

import "./globals.css";

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
