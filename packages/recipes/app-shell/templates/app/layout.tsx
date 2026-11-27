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

// Not preloaded: nothing in the starter renders monospace text.
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  preload: false,
});

const APP_NAME = "My App";

// Each page but home exports a `title` from its nav.ts label, which fills the template.
export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: "A Next.js app built on the UIID app shell.",
};

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Under a CSP, pass the request's nonce and allow the style it adds. */}
        <SidebarScript />
      </head>
      <ShellBody className={`${geistSans.variable} ${geistMono.variable}`}>
        <Shell sidebar={<Sidebar title={APP_NAME} />} header={<Header />}>
          <Main>{children}</Main>
        </Shell>
      </ShellBody>
    </html>
  );
}
