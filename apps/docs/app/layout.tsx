import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { OnThisPage, Pager } from "@/components/docs";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import {
  Body,
  AppShellOuter,
  AppShellInner,
  AsideContainer,
  ContentRow,
  Main,
} from "@/components/shell";

import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants";

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
