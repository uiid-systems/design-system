import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import { Main } from "@/components/main";
import { Shell, ShellBody } from "@/components/shell";
import { Sidebar, SidebarScript } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "A Next.js app built on the UIID app shell.",
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
        <Shell sidebar={<Sidebar title="My App" />} header={<Header />}>
          <Main>{children}</Main>
        </Shell>
      </ShellBody>
    </html>
  );
}
